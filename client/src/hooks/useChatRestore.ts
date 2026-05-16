import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchChat } from '@/lib/api/chatApi';
import { fetchUserInfo } from '@/lib/api/setupApi';
import { useChatSelectors } from '@/contexts/useChatStore';
import { useSetupSelectors } from '@/contexts/useSetupStore';
import { useAuthSelectors } from '@/contexts/useAuthStore';

export function useChatRestore() {
    const [isRestoring, setIsRestoring] = useState(false);
    const navigate = useNavigate();

    const user = useAuthSelectors.use.user();
    const chat = useChatSelectors.use.chat();
    const userInfo = useSetupSelectors.use.userInfo();
    const setChat = useChatSelectors.use.setChat();
    const setUserInfo = useSetupSelectors.use.setUserInfo();

    useEffect(() => {
        if (chat && userInfo) return;

        const uid = user?.authToken.uid;
        if (!uid) return;

        const chatId = localStorage.getItem("chatId");
        if (!chatId) {
            navigate("/");
            return;
        }

        setIsRestoring(true);

        const restoreChat = chat
            ? Promise.resolve(chat)
            : fetchChat(chatId).then((fetched) => {
                if (fetched) setChat(fetched);
                return fetched;
            });

        const restoreUserInfo = userInfo
            ? Promise.resolve(userInfo)
            : fetchUserInfo(uid).then((fetched) => {
                if (fetched) setUserInfo(fetched);
                return fetched;
            });

        Promise.all([restoreChat, restoreUserInfo]).then(([restoredChat, restoredUserInfo]) => {
            if (!restoredChat || !restoredUserInfo) {
                navigate("/");
                return;
            }
            setIsRestoring(false);
        });
    }, []);

    return { isRestoring: isRestoring || !chat || !userInfo };
}
