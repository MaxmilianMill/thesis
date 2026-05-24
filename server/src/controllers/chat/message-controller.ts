// import type { ChatService } from "../../services/chat/chat-service.js";
// import type { MessageService } from "../../services/chat/message-service.js";
// import { WSMessageSchema, type WSMessage } from "./schemas/ws-message.js";
// import type { InfoService } from "../../services/setup/info-service.js";
// import type { FeedbackService } from "../../services/chat/feedback-service.js";
// import type { TaskListUpdaterService } from "../../services/chat/task-list-updater-service.js";
// import type { ChatSession } from "../../sessions/chat-session.js";
// import { AILiveSession } from "../../integrations/ai/live-session.js";

// export class MessageController {

//     constructor(
//         private chatService: ChatService,
//         private messageService: MessageService,
//         private infoService: InfoService,
//         private feedbackService: FeedbackService,
//         private taskListUpdateService: TaskListUpdaterService
//     ) {}

//     public async handleMessage(session: ChatSession) {
//         let liveSession: AILiveSession | null = null;

//         session.onSendMessage(
//             async (messageBuffer: Buffer) => {

//                 const {
//                     uid,
//                     chatId,
//                     message,
//                     history
//                 } = this.parseWSMessage(messageBuffer);

//                 // fetch relevant db docs
//                 const [
//                     userInfo,
//                     chat
//                 ] = await Promise.all([
//                     this.infoService.getUserData(uid),
//                     this.chatService.get(uid, chatId)
//                 ]);

//                 if (!chat.chat)
//                     throw new Error("Chat does not exist.");

//                 if (!liveSession) {
//                     const systemInstruction = this.messageService.buildSystemInstruction(userInfo.userInfo);
//                     liveSession = new AILiveSession(systemInstruction);
//                     await liveSession.connect();
//                 }

//                 await this.messageService.answerStream(
//                     liveSession,
//                     userInfo.userInfo,
//                     chat.chat,
//                     (text) => session.sendChunk(text),
//                     (audio) => session.sendAudioChunk(audio),
//                     message,
//                     history
//                 );

//                 // if the request contains a user message, we generate the feedback
//                 if (message) {
//                     const updatedMessage = await this.feedbackService.generateFeedback({
//                         userInfo: userInfo.userInfo,
//                         chat: chat.chat,
//                         message: message
//                     });

//                     session.sendMessage(updatedMessage);

//                     const updatedTaskList = await this.taskListUpdateService.update(message, chat.chat);

//                     session.sendTaskList(updatedTaskList);
//                 };

//                 session.sendDone();
//             }
//         );
//     }

//     private parseWSMessage(message: Buffer): WSMessage {

//         const rawMessage = JSON.parse(message.toString());

//         const validatedMessage = WSMessageSchema.safeParse(rawMessage);

//         if (!validatedMessage.success)
//             throw new Error(validatedMessage.error.message);

//         return validatedMessage.data;
//     }
// }