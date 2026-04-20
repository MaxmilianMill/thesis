import WebSocket from "ws";
import { ClientSession } from "./client-session.js";
import { AISession } from "./ai-session.js";
import type { AISessionService } from "../services/chat/ai-session-service.js";
import type { Message, UserInfo, WSPayload } from "@thesis/types";
import type { WSMessage } from "@thesis/types"
import type { Chat } from "@thesis/types";
import { FeedbackService } from "../services/chat/feedback-service.js";
import { TaskListUpdaterService } from "../services/chat/task-list-updater-service.js";

interface TurnContext {
    transcript: string;
    message?: WSMessage['message'];
    history?: WSMessage['history'];
}

export class ChatSession {
    client: ClientSession;
    ai: AISession | undefined;
    processingMessage: boolean = false;
    private processingMessagePromise: Promise<void> | null = null;

    // track the full transcript to generate the feedback
    private currentTurn: TurnContext = { transcript: "" };
    private taskListUpdaterService: TaskListUpdaterService;

    constructor(
        client: WebSocket,
        public aiSessionService: AISessionService,
        public feedbackService: FeedbackService,
        public userInfo: UserInfo,
        public chat: Chat
    ) {
        this.client = new ClientSession(client);
        this.ai = new AISession(aiSessionService, userInfo);
        this.feedbackService = feedbackService;
        this.taskListUpdaterService = new TaskListUpdaterService();

        this.initializeListeners();
    };

    initializeListeners() {
        this.client.on('user_msg', async (data: WSMessage) => {
            if (data.type === "recording_start") {
                // start a new turn
                this.currentTurn = {
                    transcript: "",
                    message: data.message,
                    history: data.history
                };

                this.ai?.handleRecordingStart(this.chat, data.history);
                return;
            }

            if (data.type === "recording_stop") {
                this.ai?.handleRecordingStop();
                return;
            }

            if (data.type === "audio" && data.rawAudio) {
                this.ai?.handleAudioChunk(data.rawAudio);
                return;
            }

            if (data.type === "text") {
                this.currentTurn = {
                    transcript: data.message?.text ?? "",
                    message: data.message,
                    history: data.history
                };
                this.ai?.handleSendTextMessage(this.chat, data.message, data.history);
            }
        });

        this.ai?.on('ai_msg', (aiResponse: WSPayload) => {
            this.client.sendAIResponse(aiResponse);

            // cache user transcript to generate feedback
            if (aiResponse.type === "user_msg") 
                this.currentTurn.transcript += aiResponse.data;

            // if its the first ai message, the user transcription is present
            // we then start the feedback generation and task list updates
            if(aiResponse.type === "ai_msg" && !this.processingMessage) {
                this.processingMessage = true;
                this.processingMessagePromise = this.processUserMessage();
            }
        });

        this.ai?.on('turn_complete', async () => {
            this.client.sendAIResponse({ type: "done", data: null });
            
            this.cleanupState();
        });

        // Robust Cleanup (If one dies, kill the other)
        this.client.on('disconnected', () => {
            console.log("User left. Shutting down AI.");
            this.ai?.close();
            this.cleanupState();
        });

        this.ai?.on('disconnected', async () => {
            console.log("AI connection dropped. Disconnecting user.");
            await this.cleanupState();
            this.client.close();
        });
    };

    private async cleanupState() {
        if (this.processingMessagePromise) {
            await this.processingMessagePromise;
            this.processingMessagePromise = null;
        }
        this.processingMessage = false;
    };

    private async  processUserMessage() {
        const turnSnapshot = { ...this.currentTurn };
        this.currentTurn = { transcript: "" };

        const finalTranscript = turnSnapshot.transcript.trim();

        if (finalTranscript.length > 0) {
            try {
                console.log("Generating feedback with message: ", finalTranscript);

                const updatedMessage = {
                    ...turnSnapshot.message,
                    // add the final context or the initial text if it was a text message
                    text: finalTranscript ?? this.currentTurn.message?.text
                } as Message;
                
                // 5. Pass the cached history and message to your service
                const feedback = await this.feedbackService.generateFeedback({
                    userInfo: this.userInfo,
                    chat: this.chat,
                    message: updatedMessage,
                    history: turnSnapshot.history      
                });

                this.client.sendFeedback({
                    type: "feedback",
                    data: feedback
                });

                const updatedTaskList = await this.taskListUpdaterService
                    .update(updatedMessage, this.chat);

                this.client.sendTaskListUpdates({
                    type: "taskList",
                    data: updatedTaskList
                });

            } catch (error) {
                console.error("Failed to generate feedback:", (error as Error).message);
            }
        }
    }
}