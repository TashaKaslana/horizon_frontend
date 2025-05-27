import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import {UserSummaryRespond} from "@/api/client";

export interface UserPage {
    data?: UserSummaryRespond[];
    // Add other properties that might be part of your page structure, e.g., nextPageCursor, totalCount
}

interface UsersState {
    users: UserSummaryRespond[];
    infiniteQueryData: InfiniteData<UserPage> | null;
    actions: {
        setInfiniteQueryData: (data: InfiniteData<UserPage> | null) => void;
        clearAllData: () => void;
        updateUser: (user: UserSummaryRespond) => void;
        removeUser: (userId: string) => void;
    };
}

const useUsersStore = create<UsersState>()(
    immer((set) => ({
        users: [],
        infiniteQueryData: null,
        actions: {
            setInfiniteQueryData: (data) =>
                set((state) => {
                    state.infiniteQueryData = data;
                    state.users = data?.pages?.flatMap((page: UserPage) => page.data ?? []) ?? [];
                }),
            updateUser: (updatedUser) =>
                set((state) => {
                    state.users = state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u));

                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map((page) => ({
                            ...page,
                            data: (page.data ?? []).map((u) => (u.id === updatedUser.id ? updatedUser : u)),
                        }));
                    }
                }),

            removeUser: (userId) =>
                set((state) => {
                    state.users = state.users.filter((u) => u.id !== userId);

                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages
                            .map((page) => ({
                                ...page,
                                data: (page.data ?? []).filter((u) => u.id !== userId),
                            }))
                            .filter((page) => (page.data?.length ?? 0) > 0);
                    }
                }),

            clearAllData: () =>
                set((state) => {
                    state.users = [];
                    state.infiniteQueryData = null;
                }),
        },
    }))
);

export default useUsersStore;