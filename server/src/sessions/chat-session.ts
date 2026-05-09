import WebSocket from "ws";
import { ClientSession } from "./client-session.js";
import { AISession } from "./ai-session.js";
import type { AISessionService } from "../services/chat/ai-session-service.js";
import type { Message, UserInfo, WSPayload } from "@thesis/types";
import type { WSMessage } from "@thesis/types"
import type { Chat } from "@thesis/types";
import { FeedbackService } from "../services/chat/feedback-service.js";
import { TaskListUpdaterService } from "../services/chat/task-list-updater-service.js";
import { MessageService } from "../services/chat/message-service.js";
import { saveTaskList } from "../repository/chat/task-list-repository.js";
import { log } from "../services/logger/activity-logger-service.js";

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

    private currentTurn: TurnContext = { transcript: "" };
    private currentAiTranscript: string = "";
    private taskListUpdaterService: TaskListUpdaterService;

    constructor(
        client: WebSocket,
        public aiSessionService: AISessionService,
        public feedbackService: FeedbackService,
        public messageService: MessageService,
        public userInfo: UserInfo,
        public chat: Chat
    ) {
        this.client = new ClientSession(client);
        this.ai = new AISession(aiSessionService, userInfo);
        this.feedbackService = feedbackService;
        this.messageService = messageService;
        this.taskListUpdaterService = new TaskListUpdaterService();

        this.initializeListeners();
    };

    initializeListeners() {
        this.client.on('user_msg', async (data: WSMessage) => {

            if (data.type === "recording_start") {
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
                return;
            }

            if (data.type === "hint_used" && typeof data.taskId === "number") {
                this.applyHelpFlag(data.taskId, "hint");
                return;
            }

            if (data.type === "solution_used" && typeof data.taskId === "number") {
                this.applyHelpFlag(data.taskId, "solution");
                return;
            }
        });

        this.ai?.on('ai_msg', (aiResponse: WSPayload) => {
            this.client.sendAIResponse(aiResponse);

            if (aiResponse.type === "user_msg")
                this.currentTurn.transcript += aiResponse.data;

            if (aiResponse.type === "ai_msg")
                this.currentAiTranscript += aiResponse.data;

            if (aiResponse.type === "ai_msg" && !this.processingMessage) {
                this.processingMessage = true;
                this.processingMessagePromise = this.processUserMessage();
            }
        });

        this.ai?.on('turn_complete', async () => {
            this.client.sendAIResponse({ type: "done", data: null });

            const aiText = this.currentAiTranscript.trim();
            this.currentAiTranscript = "";

            if (aiText) {
                this.messageService.save({
                    uid: this.userInfo.uid,
                    chatId: this.chat.id,
                    isUser: false,
                    text: aiText,
                    createdAt: new Date()
                }).catch(err => console.error("Failed to save AI message:", err));
            }

            this.cleanupState();
        });

        this.client.on('disconnected', () => {
            console.log("User left. Shutting down AI.");
            this.ai?.close();
            this.cleanupState();
        });

        this.ai?.on('disconnected', async () => {
            console.log("AI connection dropped. Disconnecting user.");
            // Notify the client first so it can show a friendly message and
            // trigger reconnect logic instead of seeing only a raw close.
            this.client.sendAIResponse({ type: "ai_disconnected", data: null });
            await this.cleanupState();
            this.client.close();
        });
    };

    private applyHelpFlag(taskId: number, kind: "hint" | "solution") {
        const task = this.chat.taskList.find((t) => t.id === taskId);
        if (!task) return;

        if (task[kind].used) return;
        task[kind].used = true;

        saveTaskList(this.userInfo.uid, this.chat.id, this.chat.taskList)
            .catch((err) => console.error(`Failed to persist ${kind} reveal:`, err));
    }

    private async cleanupState() {

        log({
            action: "cleanup_turn",
            status: "success",
            uid: this.userInfo.uid,
            relatedIds: {
                chatId: this.chat.id
            }
        })

        if (this.processingMessagePromise) {
            await this.processingMessagePromise;
            this.processingMessagePromise = null;
        }
        this.processingMessage = false;
    };

    private async processUserMessage() {
        const turnSnapshot = { ...this.currentTurn };
        this.currentTurn = { transcript: "" };

        const finalTranscript = turnSnapshot.transcript.trim();

        if (finalTranscript.length > 0) {
            try {
                const userMessage: Message = {
                    id: crypto.randomUUID(),
                    uid: this.userInfo.uid,
                    isUser: true,
                    text: finalTranscript,
                    createdAt: new Date()
                };

                const feedback = await this.feedbackService.generateFeedback({
                    userInfo: this.userInfo,
                    chat: this.chat,
                    message: userMessage,
                    history: turnSnapshot.history
                });

                this.messageService.save({
                    uid: this.userInfo.uid,
                    chatId: this.chat.id,
                    isUser: true,
                    text: userMessage.text,
                    createdAt: userMessage.createdAt,
                    isCorrect: feedback.isCorrect,
                    improvedVersion: feedback.improvedVersion,
                    mistakes: feedback.mistakes
                }).catch(err => console.error("Failed to save user message:", err));

                this.client.sendFeedback({
                    type: "feedback",
                    data: feedback
                });

                const updatedTaskList = await this.taskListUpdaterService
                    .update(userMessage, this.chat);

                // Merge in any hint/solution reveals that may have arrived
                // while the AI updater was running. `used` is monotonic — once
                // true, it stays true — so a simple OR is safe.
                const merged = updatedTaskList.map((task) => {
                    const live = this.chat.taskList.find((t) => t.id === task.id);
                    if (!live) return task;
                    return {
                        ...task,
                        hint: { ...task.hint, used: task.hint.used || live.hint.used },
                        solution: { ...task.solution, used: task.solution.used || live.solution.used }
                    };
                });

                this.chat.taskList = merged;

                this.client.sendTaskListUpdates({
                    type: "taskList",
                    data: merged
                });

                saveTaskList(this.userInfo.uid, this.chat.id, merged)
                    .catch((err) => console.error("Failed to persist taskList:", err));

            } catch (error) {
                console.error("Failed to generate feedback:", (error as Error).message);
            }
        }
    }
}
