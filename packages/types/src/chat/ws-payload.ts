export type WSEventType = "error" | "done" | "message" | "text" | "taskList" | "audio" | "ai_msg" | "user_msg" | "feedback" | "ai_disconnected";

export type WSPayload = {
    type: WSEventType;
    data: any;
}