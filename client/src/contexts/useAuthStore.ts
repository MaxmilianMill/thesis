import type { User } from "@thesis/types";
import { create } from "zustand";
import { createSelectors } from "./utils/createSelectors";

interface AuthState {
    user: User | undefined;
    setUser: (user: User) => void;
    resetUser: () => void;
};

const SESSION_DURATION_HOURS = 4;

function loadUserFromStorage(): User | undefined {
    try {
        const raw = localStorage.getItem("user");
        if (!raw) return undefined;
        const user = JSON.parse(raw) as User;
        const hoursDiff = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60);
        if (hoursDiff >= SESSION_DURATION_HOURS) {
            ["user", "token", "uid"].forEach((k) => localStorage.removeItem(k));
            localStorage.setItem("participated", "true");
            return undefined;
        }
        return user;
    } catch {
        return undefined;
    }
}

const useAuthStore = create<AuthState>((set) => ({
    user: loadUserFromStorage(),
    setUser: (user) => set({user}),
    resetUser: () => set({user: undefined})
}));

export const useAuthSelectors = createSelectors(useAuthStore);