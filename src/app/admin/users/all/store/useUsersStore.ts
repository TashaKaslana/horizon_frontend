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
        // Future actions like updateUser, removeUser can be added here
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
            clearAllData: () =>
                set((state) => {
                    state.users = [];
                    state.infiniteQueryData = null;
                }),
        },
    }))
);

export default useUsersStore;