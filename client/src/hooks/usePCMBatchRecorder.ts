import { useState, useRef, useCallback } from 'react';

export function usePCMBatchRecorder(onFullAudioReady: (base64String: string) => void) {
    const [isRecording, setIsRecording] = useState(false);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    
    // NEW: We will store the Int16 chunks here while recording
    const pcmChunksRef = useRef<Int16Array[]>([]);

    const startRecording = useCallback(async () => {
        try {
            pcmChunksRef.current = []; // Clear previous recordings

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { channelCount: 1, sampleRate: 16000 }
            });
            streamRef.current = stream;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: 16000 
            });
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const int16Chunk = new Int16Array(inputData.length);

                for (let i = 0; i < inputData.length; i++) {
                    const s = Math.max(-1, Math.min(1, inputData[i]));
                    // Convert to 16-bit integer (Little Endian logic)
                    int16Chunk[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }

                // NEW: Push to our accumulator instead of emitting
                pcmChunksRef.current.push(int16Chunk);
            };

            source.connect(processor);
            processor.connect(audioContext.destination); 

            setIsRecording(true);
        } catch (error) {
            console.error("Failed to start PCM recording:", error);
        }
    }, []);

    const stopRecording = useCallback(() => {
        // 1. Stop hardware
        if (processorRef.current) processorRef.current.disconnect();
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) audioContextRef.current.close();
        
        setIsRecording(false);

        // --- 2. MERGE ALL CHUNKS ---
        const totalLength = pcmChunksRef.current.reduce((acc, chunk) => acc + chunk.length, 0);
        const fullPcmData = new Int16Array(totalLength);
        let offset = 0;
        
        for (const chunk of pcmChunksRef.current) {
            fullPcmData.set(chunk, offset);
            offset += chunk.length;
        }

        // --- 3. CONVERT MASSIVE BUFFER TO BASE64 ---
        let binary = '';
        const bytes = new Uint8Array(fullPcmData.buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        
        const fullBase64 = window.btoa(binary);

        // 4. Fire the callback with the complete audio message
        if (onFullAudioReady) {
            onFullAudioReady(fullBase64);
        }
    }, [onFullAudioReady]);

    return { isRecording, startRecording, stopRecording };
}