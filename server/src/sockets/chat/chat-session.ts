import type { Task } from "../../integrations/ai/schemas/task-list.js";
import type { Message } from "../../types/chat/message.js";
import type { WSPayload } from "../utils/ws-payload.js";
import type WebSocket from "ws";

export class ChatSession {
      constructor(public ws: WebSocket) {}

      sendChunk(text: string)     { this.send({ type: "text",     data: text }); }
      sendMessage(msg: Message)   { this.send({ type: "message",  data: msg  }); }
      sendTaskList(list: Task[])  { this.send({ type: "taskList", data: list }); }
      sendDone()                  { this.send({ type: "done",     data: undefined}); }
      sendError(message: string) {
          this.send({ type: "error", data: message });
      };

      onSendMessage(handler: (buffer: Buffer) => Promise<any>) {
        try {
            this.ws.on("message", handler);
        } catch (error) {
            this.sendError((error as Error).message)
        }
      }

      private send(payload: WSPayload): void {
          if (this.ws.readyState !== 1) return;
          try {
              this.ws.send(JSON.stringify(payload));
          } catch (err) {
              console.error("WS send failed:", err);
          }
      }
  }