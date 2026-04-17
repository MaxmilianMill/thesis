import type { User } from "@thesis/types";
import { create } from "zustand";
import { createSelectors } from "./utils/createSelectors";

interface AuthState {
    user: User | undefined;
    setUser: (user: User) => void;
    resetUser: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
    user: undefined,
    setUser: (user) => set({user}),
    resetUser: () => set({user: undefined})
}));

export const useAuthSelectors = createSelectors(useAuthStore);