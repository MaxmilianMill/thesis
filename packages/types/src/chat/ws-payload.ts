export type WSEventType = "error" | "done" | "message" | "text" | "taskList" | "audio" | "ai_msg" | "user_msg" | "feedback";

export type WSPayload = {
    type: WSEventType;
    data: any;
}