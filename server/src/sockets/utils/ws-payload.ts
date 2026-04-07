export type WSEventType = "error" | "done" | "message" | "text" | "taskList";

export type WSPayload = {
    type: WSEventType;
    data: any;
}