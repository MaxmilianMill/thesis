import type { Chat } from "../../types/chat/chat.js";
import type { Message } from "../../types/chat/message.js";
import type { UserInfo } from "../../types/setup/user-info.js";

interface IFeedbackInput {
    userInfo: UserInfo;
    chat: Chat;
    message: Message;
    history?: Message[];
};

export class FeedbackService {

    public async generateFeedback(data: IFeedbackInput) {

    };

    private buildPrompt() {
        
    };

    private getConfig() {

    };
};