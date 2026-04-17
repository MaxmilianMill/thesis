import { useEffect, useRef, useState } from "react"
import { useAudioMessageStream } from "./useAudioStream";
import { useAudioRecorder } from "./useAudioRecorder";
import type { WSMessage } from "@thesis/types";
import { useAuthSelectors } from "@/contexts/useAuthStore";
import { useChatSelectors } from "@/contexts/useChatStore";

export const useMessageController = () => {

    const wsRef = useRef<WebSocket | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
    const user = useAuthSelectors.use.user();
    const chat = useChatSelectors.use.chat();

    const {
        initAudio,
        playAudioChunk,
        resetAudioQueue
    } = useAudioMessageStream();

    // send the user audio message to the server
    const handleOnAudioReady = (base64AudioChunk: string) => {

        if (!wsRef.current) {
            console.error("Cant send audio chunk. WebSocket is undefined");
            return;
        }

        if (wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: "audio",
                rawAudio: base64AudioChunk
            } as WSMessage));

            console.log("User message sent!");
        }
    }

    const {
        toggleRecording,
        isRecording
    } = useAudioRecorder(handleOnAudioReady);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:3000/ws/chat?uid=${"1e17ebf2-74b1-4468-80d6-d11dcc8196f2"}&chatId=${"69e20e992c9192317f8b7613"}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected!");
            setConnectionStatus(true);
        }

        ws.onmessage = (event) => {
            const payload = JSON.parse(event.data);

            console.log(payload);

            if (payload.type === "audio") {
                playAudioChunk(payload.data);
            }

            if (payload.type === "text") {
                // 
            }
        }

        ws.onerror = (errorEvent) => {
            console.error(errorEvent);
            setConnectionStatus(false);
        };

        ws.onclose = (closeEvent) => {
            console.warn(closeEvent);
            setConnectionStatus(false);
        }

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, [playAudioChunk, resetAudioQueue])

    const sendTextMessage = (text: string) => {
        if (!text.trim()) return;
        initAudio(); 

        console.log("Message sent: ", text)
        console.log(wsRef.current?.readyState)

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                uid: "1e17ebf2-74b1-4468-80d6-d11dcc8196f2",
                chatId: "69e20e992c9192317f8b7613",
                type: "text", 
                text: text 
            } as WSMessage));
            
        }
    };

    return {
        connectionStatus,
        toggleRecording,
        isRecording,
        sendTextMessage
    }
}