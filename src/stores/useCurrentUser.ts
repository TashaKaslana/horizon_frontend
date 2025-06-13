'use client'
import {User} from "@/types/user";
import {create} from "zustand";

type CurrentUserStore = {
    user: User | null
    sub: string;
    setSub: (sub: string) => void;
    setUser: (user: User) => void
    clearUser: () => void
}

export const useCurrentUser = create<CurrentUserStore>((set) => ({
    user: null,
    sub: '',
    setSub: (sub) => set({ sub }),
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}))