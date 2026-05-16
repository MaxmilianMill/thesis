import { EventEmitter } from "events";
import WebSocket from "ws";
import { WSMessageSchema, type Message, type WSMessage } from "@thesis/types";
import type { WSPayload } from "@thesis/types"

export class ClientSession extends EventEmitter {

    constructor(public ws: WebSocket) {
        super();
        this.ws = ws;

        this.attachListeners();
    };

    attachListeners() {
        this.ws.on("message", (rawData) => {
            try {
                const data = this.parseRawInput(rawData);
                this.emit("user_msg", data);
            } catch (err) {
                console.error("Invalid client message:", (err as Error).message);
                this.safeSend({ type: "error", data: "invalid_message" });
            }
        });

        this.ws.on("error", (err) => {
            console.error("Client socket error:", err);
            this.emit("disconnected");
        });

        this.ws.on('close', () => this.emit('disconnected'));
    };

    sendAIResponse(aiResponse: WSPayload) {

        this.safeSend(aiResponse);
    };

    sendFeedback(feedback: WSPayload) {

        this.safeSend(feedback);
    };

    sendTaskListUpdates(updatedTaskList: WSPayload) {
        this.safeSend(updatedTaskList);
    }

    close() {
        this.ws.close(4000, "AI session ended");
    };

    private safeSend(payload: WSPayload): void {
        if (this.ws.readyState !== WebSocket.OPEN) return;

        this.ws.send(JSON.stringify(payload));
    }

    private parseRawInput(rawData: WebSocket.RawData): WSMessage {

        const jsonData = JSON.parse(rawData.toString());
        console.log("Raw data: ", jsonData)

        const validatedMessage = WSMessageSchema.safeParse(jsonData);
        
        if (!validatedMessage.success)
            throw new Error(validatedMessage.error.message);

        return validatedMessage.data;
    }
}