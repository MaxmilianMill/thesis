import { useChatSelectors } from "@/contexts/useChatStore";

export const useChatLifecycle = (messageLimit: number = 20) => {

    const chat = useChatSelectors.use.chat();
    const history = useChatSelectors.use.history();

    // check if all tasks are completed
    const allTasksCompleted = chat?.taskList && chat.taskList.length > 0 && 
                              chat.taskList.every(task => task.completed);

    // check if message limit is reached
    const isLimitReached = history.length >= messageLimit;

    // determine overall completion state
    const isChatFinished = allTasksCompleted || isLimitReached;

    return {
        isChatFinished,
        allTasksCompleted,
        isLimitReached
    };
};