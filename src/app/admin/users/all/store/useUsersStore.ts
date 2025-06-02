import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import {DailyCountDto, OverviewStatistic, UserIntroduction, UserRespondDto} from "@/api/client";

export interface UserPage {
    data?: UserIntroduction[];
    // Add other properties that might be part of your page structure, e.g., nextPageCursor, totalCount
}

interface UsersState {
    users: UserIntroduction[];
    selectedUser: UserRespondDto | null;
    infiniteQueryData: InfiniteData<UserPage> | null;
    overviewData: OverviewStatistic[]
    chartData: DailyCountDto[]
    actions: {
        setInfiniteQueryData: (data: InfiniteData<UserPage> | null) => void;
        setSelectedUser: (user: UserRespondDto | null) => void;
        setOverviewData: (data: OverviewStatistic[]) => void;
        setChartData: (data: DailyCountDto[]) => void;
        clearAllData: () => void;
        addUser: (user: UserIntroduction) => void;
        updateUser: (user: UserIntroduction) => void;
        removeUser: (userId: string) => void;
        setUsers: (users: UserIntroduction[]) => void; // Added for DND updates
    };
}

const useUsersStore = create<UsersState>()(
    immer((set) => ({
        users: [],
        infiniteQueryData: null,
        selectedUser: null,
        overviewData: [],
        chartData: [],
        actions: {
            setInfiniteQueryData: (data) =>
                set((state) => {
                    state.infiniteQueryData = data;
                    state.users = data?.pages?.flatMap((page: UserPage) => page.data ?? []) ?? [];
                }),

            setSelectedUser: (user) =>
                set((state) => {
                    state.selectedUser = user;
                }),

            setOverviewData: (data) =>
                set((state) => {
                    state.overviewData = data;
                }),

            setChartData: (data) =>
                set((state) => {
                    state.chartData = data;
                }),

            addUser: (newUser) =>
                set((state) => {
                    state.users.unshift(newUser);

                    if (state.infiniteQueryData) {
                        const firstPage = state.infiniteQueryData.pages[0];
                        if (firstPage) {
                            firstPage.data = [newUser, ...(firstPage.data ?? [])];
                        }
                    }
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

            setUsers: (newUsers) =>
                set((state) => {
                    state.users = newUsers;
                    if (state.infiniteQueryData) {
                        const remainingUsers = [...newUsers];
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageUsersCount = page.data?.length || 0;
                            const usersForThisPage = remainingUsers.splice(0, pageUsersCount);
                            return {
                                ...page,
                                data: usersForThisPage
                            };
                        }).filter(page => page.data && page.data.length > 0);

                        if (newUsers.length > 0 && state.infiniteQueryData.pages.length === 0) {
                            state.infiniteQueryData.pages = [{ data: newUsers }];
                            state.infiniteQueryData.pageParams = [0];
                        }
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

