import { useEffect, useRef, useState } from "react"
import { useAudioMessageStream } from "./useAudioStream";
import type { WSMessage } from "@thesis/types";
import { useChatSelectors } from "@/contexts/useChatStore";
import { AudioStreamer } from "./lib/audio-streamer";
import { audioContext } from "./lib/utils";
import VolMeterWorket from "./lib/worklets/vol-meter";
import { AudioRecorder } from "./lib/audio-recorder";
// import { useAuthSelectors } from "@/contexts/useAuthStore";
// import { useChatSelectors } from "@/contexts/useChatStore";

export const useMessageController = () => {

    const wsRef = useRef<WebSocket | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
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
        history
    } = useChatSelectors();

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:3000/ws/chat?uid=${"1e17ebf2-74b1-4468-80d6-d11dcc8196f2"}&chatId=${"69e20e992c9192317f8b7613"}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected!");
            setConnectionStatus(true);

            if (!audioStreamerRef.current) {
                console.log('🔊 Initializing audio streamer...');
                audioContext({ id: "audio-out" }).then((audioCtx: AudioContext) => {
                    audioStreamerRef.current = new AudioStreamer(audioCtx);
                    console.log('🔊 Audio context created, sample rate:', audioCtx.sampleRate);
                    audioStreamerRef.current
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .addWorklet<any>("vumeter-out", VolMeterWorket, (ev: any) => {
                            setInVolume(ev.data.volume);
                        })
                        .then(() => {
                            console.log('✅ Output volume meter worklet added');
                        });
                });
            }
        }

        ws.onmessage = (event) => {
            const payload = JSON.parse(event.data);

            console.log(payload);

            switch (payload.type) {

                case "audio": 
                    playAudioChunk(payload.data);
                    break;

                case "user_msg":
                    appendUserStreamChunk(payload.data);
                    break;

                case "ai_msg":
                    appendAIStreamChunk(payload.data);
                    break;

                // if turn is complete or something happend on the server side
                case "done":
                    resetAudioQueue();
                    finalizeAITurn();
                    break;

                default:
                    console.warn("Unknwon payload type: ", JSON.stringify(payload));
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
    }, [playAudioChunk, resetAudioQueue]);

    useEffect(() => {
        const onInputAudio = (base64Audio: string) => {
            if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

            wsRef.current.send(JSON.stringify({
                uid: "1e17ebf2-74b1-4468-80d6-d11dcc8196f2",
                chatId: "69e20e992c9192317f8b7613",
                type: "audio",
                rawAudio: base64Audio
            } as WSMessage));
        };

        if (wsRef.current && audioRecorder && isRecording) {
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
    }, [audioRecorder, isRecording]);

    const toggleRecording = () => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        const nextRecording = !isRecording;

        // initAudio must be called during a user gesture so the AudioContext is allowed to start
        initAudio();

        if (nextRecording) {
            ws.send(JSON.stringify({
                uid: "1e17ebf2-74b1-4468-80d6-d11dcc8196f2",
                chatId: "69e20e992c9192317f8b7613",
                type: "recording_start",
            } as WSMessage));
        } else {
            ws.send(JSON.stringify({
                uid: "1e17ebf2-74b1-4468-80d6-d11dcc8196f2",
                chatId: "69e20e992c9192317f8b7613",
                type: "recording_stop",
            } as WSMessage));
        }

        setIsRecording(nextRecording);
    };

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
        sendTextMessage,
        history,
        inVolume
    }
}