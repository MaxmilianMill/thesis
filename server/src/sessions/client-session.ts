import { EventEmitter } from "events";
import WebSocket from "ws";
import { WSMessageSchema, type WSMessage } from "../controllers/chat/schemas/ws-message.js";
import type { WSPayload } from "../sockets/utils/ws-payload.js";

export class ClientSession extends EventEmitter {

    constructor(public ws: WebSocket) {
        super();
        this.ws = ws;

        this.attachListeners();
    };

    attachListeners() {
        this.ws.on("message", (rawData) => {
            const data = this.parseRawInput(rawData);

            this.emit("user_msg", data);
        });

        this.ws.on('close', () => this.emit('disconnected'));
    };

    sendAIResponse(audioChunk?: string, textChunk?: string) {

        const response: WSPayload = {
            type: audioChunk ? "audio" : "text",
            data: { textChunk, audioChunk }
        };

        this.ws.send(JSON.stringify(response));
    };

    close() {
        this.ws.close();
    };

    private parseRawInput(rawData: WebSocket.RawData): WSMessage {

        const jsonData = JSON.parse(rawData.toString());

        const validatedMessage = WSMessageSchema.safeParse(jsonData);
        
        if (!validatedMessage.success)
            throw new Error(validatedMessage.error.message);

        return validatedMessage.data;
    }
}