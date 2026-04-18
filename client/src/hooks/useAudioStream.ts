import { useCallback, useRef } from "react"

export const useAudioMessageStream = () => {
     
    const audioContextRef = useRef<AudioContext | null>(null);
    const nextPlayTimeRef = useRef(0);

    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            // Added webkitAudioContext for iOS/Safari support
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContextClass();
        }

        if (audioContextRef.current.state === "suspended") {
            audioContextRef.current.resume();
        }
    }, [])

    const playAudioChunk = useCallback(async (base64Audio: string) => {
        if (!audioContextRef.current || !base64Audio) return;

        try {
            // --- 1. AGGRESSIVE RESUME ---
            // Ensure context hasn't been put to sleep while waiting for network
            if (audioContextRef.current.state === "suspended") {
                await audioContextRef.current.resume();
            }

            // Clean the Base64 string
            let cleanBase64 = base64Audio.includes(',') ? base64Audio.split(',')[1] : base64Audio;
            cleanBase64 = cleanBase64.trim();
            while (cleanBase64.length % 4 !== 0) cleanBase64 += '=';

            // Decode Base64 to raw binary bytes
            const binaryString = window.atob(cleanBase64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            // --- 2. ODD-BYTE SAFEGUARD ---
            // If the chunk was split unevenly over the network, drop the dangling byte
            const validLen = bytes.length % 2 === 0 ? bytes.length : bytes.length - 1;
            const int16Array = new Int16Array(bytes.buffer, 0, validLen / 2);

            // Convert the 16-bit ints to 32-bit floats
            const float32Array = new Float32Array(int16Array.length);
            for (let i = 0; i < int16Array.length; i++) {
                float32Array[i] = int16Array[i] / 32768.0;
            }

            // Gemini Live API streams audio at 24kHz
            const sampleRate = 24000; 
            const audioBuffer = audioContextRef.current.createBuffer(
                1,
                float32Array.length, 
                sampleRate
            );

            audioBuffer.getChannelData(0).set(float32Array);

            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);

            // Gapless scheduling
            const currentTime = audioContextRef.current.currentTime;
            if (nextPlayTimeRef.current < currentTime) {
                nextPlayTimeRef.current = currentTime;
            }

            source.start(nextPlayTimeRef.current);
            nextPlayTimeRef.current += audioBuffer.duration;

            console.log(`🔊 Playing audio chunk: ${audioBuffer.duration.toFixed(2)}s`);

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