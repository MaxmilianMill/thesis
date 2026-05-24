import type { UserInfo } from "@thesis/types";
import { create } from "zustand";
import { createSelectors } from "./utils/createSelectors";

interface SetupState {
    userInfo: UserInfo | undefined;
    draftUserInfo: Partial<UserInfo>;
    setUserInfo: (userInfo: UserInfo) => void;
    updateUserInfo: (updatedFields: Partial<UserInfo>) => void;
    updateDraft: (updatedFields: Partial<UserInfo>) => void;
    resetDraft: () => void;
};

const useSetupStore = create<SetupState>((set) => ({
    userInfo: undefined,
    draftUserInfo: {},
    setUserInfo: (userInfo) => set({userInfo}),
    updateUserInfo: (updatedFields) => {
        set((prev) => {
            if (!prev.userInfo) {
                return prev; 
            }

            return {
                ...prev,
                userInfo: {
                    ...prev.userInfo,
                    ...updatedFields,
                },
            };
        })
    },
    updateDraft: (updatedFields) => set((state) => ({
        draftUserInfo: {...state.draftUserInfo, ...updatedFields}
    })),
    resetDraft: () => set({draftUserInfo: {}})
}));

export const useSetupSelectors = createSelectors(useSetupStore);