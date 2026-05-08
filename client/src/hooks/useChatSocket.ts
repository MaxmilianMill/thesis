import { useCallback, useEffect, useRef, useState } from "react";

type SendOptions = {
    // If true, the payload is dropped instead of queued when the socket
    // is not OPEN. Use for time-sensitive bursty data like audio chunks.
    dropIfOffline?: boolean;
};

type Subscriber = (payload: unknown) => void;

type UseChatSocketArgs = {
    uid?: string;
    chatId?: string;
};

const QUEUE_LIMIT = 20;
const BACKOFF_STEPS_MS = [500, 1000, 2000, 5000, 10000];
// Close codes we should not retry on (e.g. policy violation = bad creds)
const TERMINAL_CLOSE_CODES = new Set([1008, 4000, 4001, 4003]);

export function useChatSocket({ uid, chatId }: UseChatSocketArgs) {
    const wsRef = useRef<WebSocket | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<boolean>(false);

    const subscribersRef = useRef<Set<Subscriber>>(new Set());
    const queueRef = useRef<string[]>([]);
    const reconnectAttemptRef = useRef<number>(0);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isUnmountingRef = useRef<boolean>(false);
    const giveUpRef = useRef<boolean>(false);

    const clearReconnectTimer = () => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
    };

    const flushQueue = (ws: WebSocket) => {
        while (queueRef.current.length > 0 && ws.readyState === WebSocket.OPEN) {
            const next = queueRef.current.shift();
            if (next) ws.send(next);
        }
    };

    useEffect(() => {
        if (!uid || !chatId) return;

        isUnmountingRef.current = false;
        giveUpRef.current = false;
        reconnectAttemptRef.current = 0;

        const connect = () => {
            if (isUnmountingRef.current || giveUpRef.current) return;

            const ws = new WebSocket(
                `ws://localhost:3000/ws/chat?uid=${uid}&chatId=${chatId}`
            );
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("WebSocket connected");
                reconnectAttemptRef.current = 0;
                setConnectionStatus(true);
                flushQueue(ws);
            };

            ws.onmessage = (event) => {
                let payload: unknown;
                try {
                    payload = JSON.parse(event.data);
                } catch (err) {
                    console.warn("Failed to parse ws payload", err);
                    return;
                }
                subscribersRef.current.forEach((handler) => {
                    try {
                        handler(payload);
                    } catch (err) {
                        console.error("Subscriber threw:", err);
                    }
                });
            };

            ws.onerror = (err) => {
                console.warn("WebSocket error", err);
                setConnectionStatus(false);
            };

            ws.onclose = (event) => {
                setConnectionStatus(false);
                wsRef.current = null;

                if (TERMINAL_CLOSE_CODES.has(event.code)) {
                    console.error(`Refusing to reconnect on close code ${event.code}: ${event.reason}`);
                    giveUpRef.current = true;
                    return;
                }

                if (isUnmountingRef.current) return;

                const attempt = reconnectAttemptRef.current;
                const base = BACKOFF_STEPS_MS[Math.min(attempt, BACKOFF_STEPS_MS.length - 1)];
                const jitter = Math.random() * 250;
                const delay = base + jitter;
                reconnectAttemptRef.current = attempt + 1;

                console.warn(`WebSocket closed (code=${event.code}). Reconnecting in ${Math.round(delay)}ms (attempt ${attempt + 1})`);
                reconnectTimerRef.current = setTimeout(connect, delay);
            };
        };

        connect();

        return () => {
            isUnmountingRef.current = true;
            clearReconnectTimer();
            const ws = wsRef.current;
            if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
                ws.close();
            }
            wsRef.current = null;
            queueRef.current = [];
            setConnectionStatus(false);
        };
    }, [uid, chatId]);

    const send = useCallback((payload: unknown, options: SendOptions = {}) => {
        const ws = wsRef.current;
        const serialized = JSON.stringify(payload);

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(serialized);
            return true;
        }

        if (options.dropIfOffline) return false;

        if (queueRef.current.length >= QUEUE_LIMIT) {
            queueRef.current.shift();
        }
        queueRef.current.push(serialized);
        return false;
    }, []);

    const subscribe = useCallback((handler: Subscriber) => {
        subscribersRef.current.add(handler);
        return () => {
            subscribersRef.current.delete(handler);
        };
    }, []);

    return { connectionStatus, send, subscribe };
}
