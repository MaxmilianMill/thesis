import { useEffect, useRef, useState } from "react"
import { useAudioMessageStream } from "./useAudioStream";
import type { WSMessage } from "@thesis/types";
import { useChatSelectors } from "@/contexts/useChatStore";
import { useAuthSelectors } from "@/contexts/useAuthStore";
import { AudioStreamer } from "./lib/audio-streamer";
import { audioContext } from "./lib/utils";
import VolMeterWorket from "./lib/worklets/vol-meter";
import { AudioRecorder } from "./lib/audio-recorder";
import { useChatSocket } from "./useChatSocket";

type IncomingPayload = {
    type: string;
    data?: unknown;
};

export const useMessageController = () => {

    const audioStreamerRef = useRef<AudioStreamer | null>(null);
    const [inVolume, setInVolume] = useState<number>(0);
    const [audioRecorder] = useState(() => new AudioRecorder());
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const {
        initAudio,
        playAudioChunk,
        resetAudioQueue
    } = useAudioMessageStream();

    const {
        appendAIStreamChunk,
        appendUserStreamChunk,
        finalizeAITurn,
        history,
        updateTaskList,
        addFeedback
    } = useChatSelectors();

    const user = useAuthSelectors.use.user();
    const chat = useChatSelectors.use.chat();
    const uid = user?.authToken.uid;
    const chatId = chat?.id;

    const { connectionStatus, send, subscribe } = useChatSocket({ uid, chatId });

    // Initialize the audio streamer once we are connected
    useEffect(() => {
        if (!connectionStatus || audioStreamerRef.current) return;

        audioContext({ id: "audio-out" }).then((audioCtx: AudioContext) => {
            audioStreamerRef.current = new AudioStreamer(audioCtx);
            audioStreamerRef.current
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .addWorklet<any>("vumeter-out", VolMeterWorket, (ev: any) => {
                    setInVolume(ev.data.volume);
                })
                .then(() => {
                    console.log("Output volume meter worklet added");
                });
        });
    }, [connectionStatus]);

    // Subscribe to incoming server payloads
    useEffect(() => {
        const unsubscribe = subscribe((raw) => {
            const payload = raw as IncomingPayload;

            switch (payload.type) {
                case "audio":
                    playAudioChunk(payload.data as string);
                    break;

                case "user_msg":
                    appendUserStreamChunk(payload.data as string);
                    break;

                case "ai_msg":
                    appendAIStreamChunk(payload.data as string);
                    break;

                case "done":
                    resetAudioQueue();
                    finalizeAITurn();
                    break;

                case "feedback":
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    addFeedback(payload.data as any);
                    break;

                case "taskList":
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    updateTaskList(payload.data as any);
                    break;

                case "ai_disconnected":
                    console.warn("AI session disconnected on server.");
                    break;

                case "error":
                    console.error("Server reported error:", payload.data);
                    break;

                default:
                    console.warn("Unknown payload type: ", JSON.stringify(payload));
            }
        });
        return unsubscribe;
    }, [subscribe, playAudioChunk, appendUserStreamChunk, appendAIStreamChunk, resetAudioQueue, finalizeAITurn, addFeedback, updateTaskList]);

    // Audio recorder wiring — drop chunks instead of queuing them when offline
    useEffect(() => {
        const onInputAudio = (base64Audio: string) => {
            send({
                uid,
                chatId,
                type: "audio",
                rawAudio: base64Audio
            } as WSMessage, { dropIfOffline: true });
        };

        if (audioRecorder && isRecording && connectionStatus) {
            audioRecorder.on("data", onInputAudio).on("volume", setInVolume);
            audioRecorder.start().catch((error) => {
                console.error('Failed to start audio recorder:', error);
            });
        } else {
            audioRecorder.off("data", onInputAudio).off("volume", setInVolume);
            audioRecorder.stop();
        }

        return () => {
            audioRecorder.off("data", onInputAudio).off("volume", setInVolume);
        };
    }, [uid, chatId, audioRecorder, isRecording, connectionStatus, send]);

    const toggleRecording = () => {
        if (!connectionStatus) return;

        const nextRecording = !isRecording;

        // initAudio must be called during a user gesture so the AudioContext is allowed to start
        initAudio();

        if (nextRecording) {
            send({
                uid,
                chatId,
                type: "recording_start",
                text: ""
            } as WSMessage);
        } else {
            send({
                uid,
                chatId,
                type: "recording_stop",
            } as WSMessage);
        }

        setIsRecording(nextRecording);
    };

    const sendTextMessage = (text: string) => {
        if (!text.trim()) return;
        initAudio();

        send({
            uid,
            chatId,
            type: "text",
            text: text
        } as WSMessage);
    };

    return {
        connectionStatus,
        toggleRecording,
        isRecording,
        sendTextMessage,
        history,
        inVolume
    }
}
