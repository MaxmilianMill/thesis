import { useState, useRef, useCallback } from 'react';

export const useAudioRecorder = (onAudioReady: (audioChunk: string) => void) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Initialize MediaRecorder
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

            // Collect audio data as it becomes available
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            // When recording stops, process the final audio
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                
                // Convert Blob to Base64 to send over WebSocket
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {

                    if (!reader.result) {
                        console.error("FileReader failed to process audio");
                        return;
                    }

                    if (typeof reader.result !== "string") {
                        console.warn("Data type of the FileReader result is not a string");
                        return; 
                    }

                    const base64String = reader.result;
                    // Strip the data URL prefix (e.g., "data:audio/webm;base64,")
                    const base64Data = base64String.split(',')[1]; 
                    
                    if (onAudioReady) {
                        onAudioReady(base64Data);
                    }
                };

                // Stop all tracks to release the microphone hardware
                stream.getTracks().forEach(track => track.stop());
            };

            // Start recording
            mediaRecorder.start();
            setIsRecording(true);

        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    }, [onAudioReady]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, []);

    const toggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);

    return { isRecording, toggleRecording };
}