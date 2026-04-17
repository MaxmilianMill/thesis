import { useCallback, useRef } from "react"

export const useAudioMessageStream = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const nextPlayTimeRef = useRef(0);

    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new window.AudioContext();
        }

        if (audioContextRef.current.state === "suspended") {
            audioContextRef.current.resume();
        }
    }, []);

    const playAudioChunk = useCallback(async (base64Audio: string) => {
        if (!audioContextRef.current) return;

        try {
            
            const binaryString = window.atob(base64Audio);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            };

            const arrayBuffer = bytes.buffer;

            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

            const sourceNode = audioContextRef.current.createBufferSource();

            sourceNode.buffer = audioBuffer;
            sourceNode.connect(audioContextRef.current.destination);

            const currentTime = audioContextRef.current.currentTime;

            // start immediately if queue is empty
            if (nextPlayTimeRef.current < currentTime) {
                nextPlayTimeRef.current = currentTime;
            }

            sourceNode.start(nextPlayTimeRef.current);

            nextPlayTimeRef.current += audioBuffer.duration;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error decoding or playing audio chunk: ", error.message);
        }
    }, []);

    const resetAudioQueue = useCallback(() => {
        nextPlayTimeRef.current = 0;
    }, []);

    return {
        initAudio,
        playAudioChunk,
        resetAudioQueue
    };
}