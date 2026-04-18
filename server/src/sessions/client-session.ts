import { EventEmitter } from "events";
import WebSocket from "ws";
import { WSMessageSchema, type Message, type WSMessage } from "@thesis/types";
import type { WSPayload } from "@thesis/types"
import { FeedbackService, type IFeedbackInput } from "../services/chat/feedback-service.js";

export class ClientSession extends EventEmitter {
    feedbackService: FeedbackService;

    constructor(public ws: WebSocket) {
        super();
        this.ws = ws;
        this.feedbackService = new FeedbackService();

        this.attachListeners();
    };

    attachListeners() {
        this.ws.on("message", (rawData) => {
            const data = this.parseRawInput(rawData);

            this.emit("user_msg", data);
        });

        this.ws.on('close', () => this.emit('disconnected'));
    };

    sendAIResponse(aiResponse: WSPayload) {

        this.ws.send(JSON.stringify(aiResponse));
    };

    async generateFeedback(data: IFeedbackInput) {

        const feedback = await this.feedbackService
            .generateFeedback(data);

        this.emit("feedback", feedback);
    };

    sendFeedback(feedback: Message) {

        this.ws.send(JSON.stringify(feedback));
    };

    close() {
        this.ws.close();
    };

    private parseRawInput(rawData: WebSocket.RawData): WSMessage {

        const jsonData = JSON.parse(rawData.toString());
        console.log("Raw data: ", jsonData)

        const validatedMessage = WSMessageSchema.safeParse(jsonData);
        
        if (!validatedMessage.success)
            throw new Error(validatedMessage.error.message);

        return validatedMessage.data;
    }
}