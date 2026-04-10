export type WSEventType = "error" | "done" | "message" | "text" | "taskList" | "audio";

export type WSPayload = {
    type: WSEventType;
    data: any;
}