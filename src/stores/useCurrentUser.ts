'use client'
import {User} from "@/types/user";
import {create} from "zustand";

type CurrentUserStore = {
    user: User | null
    setUser: (user: User) => void
    clearUser: () => void
}

export const useCurrentUser = create<CurrentUserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}))