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
        updateUser: (user: Partial<UserIntroduction> & { id: string }) => void; // Modified to support partial updates
        removeUser: (userId: string) => void;
        setUsers: (users: UserIntroduction[]) => void;
        // New bulk operations
        bulkUpdateUsers: (ids: string[], data: { status?: "ACTIVE" | "PENDING" | "SUSPENDED" | "DEACTIVATED", roleId?: string }) => void;
        bulkDeleteUsers: (userIds: string[]) => void;
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
            setInfiniteQueryData: (data) => set((state) => {
                state.infiniteQueryData = data;

                // If we have data, extract users from all pages
                if (data) {
                    const allUsers: UserIntroduction[] = [];
                    data.pages.forEach(page => {
                        if (page.data) {
                            allUsers.push(...page.data);
                        }
                    });
                    state.users = allUsers;
                }
            }),

            setSelectedUser: (user) => set((state) => {
                state.selectedUser = user;
            }),

            setOverviewData: (data) => set((state) => {
                state.overviewData = data;
            }),

            setChartData: (data) => set((state) => {
                state.chartData = data;
            }),

            clearAllData: () => set((state) => {
                state.users = [];
                state.infiniteQueryData = null;
                state.selectedUser = null;
                state.overviewData = [];
                state.chartData = [];
            }),

            addUser: (user) => set((state) => {
                state.users.unshift(user);

                // Also update infiniteQueryData if it exists
                if (state.infiniteQueryData?.pages.length) {
                    const firstPage = state.infiniteQueryData.pages[0];
                    if (firstPage.data) {
                        firstPage.data.unshift(user);
                    } else {
                        firstPage.data = [user];
                    }
                }
            }),

            updateUser: (userPartial) => set((state) => {
                // Find the user in the flat users array
                const index = state.users.findIndex(u => u.id === userPartial.id);
                if (index !== -1) {
                    // Merge the partial update with the existing user
                    state.users[index] = { ...state.users[index], ...userPartial };
                }

                // Also update in infiniteQueryData if it exists
                if (state.infiniteQueryData?.pages.length) {
                    state.infiniteQueryData.pages.forEach(page => {
                        if (page.data) {
                            const pageUserIndex = page.data.findIndex(u => u.id === userPartial.id);
                            if (pageUserIndex !== -1) {
                                // Apply partial update
                                page.data[pageUserIndex] = { ...page.data[pageUserIndex], ...userPartial };
                            }
                        }
                    });
                }
            }),

            removeUser: (userId) => set((state) => {
                // Remove from flat users array
                state.users = state.users.filter(u => u.id !== userId);

                // Also remove from infiniteQueryData if it exists
                if (state.infiniteQueryData?.pages.length) {
                    state.infiniteQueryData.pages.forEach(page => {
                        if (page.data) {
                            page.data = page.data.filter(u => u.id !== userId);
                        }
                    });
                }
            }),

            setUsers: (users) => set((state) => {
                state.users = users;

                // Also update the first page in infiniteQueryData if it exists
                if (state.infiniteQueryData?.pages.length) {
                    state.infiniteQueryData.pages[0].data = [...users];
                }
            }),

            // New bulk operations
            bulkUpdateUsers: (ids, data) => set((state) => {
                // Create a set for faster lookups
                const updateSet = new Set(ids);

                // Update in the flat users array
                state.users.forEach((user, index) => {
                    if (updateSet.has(user.id!)) {
                        state.users[index] = { ...user, ...data };
                    }
                });

                // Also update in infiniteQueryData if it exists
                if (state.infiniteQueryData?.pages.length) {
                    state.infiniteQueryData.pages.forEach(page => {
                        if (page.data) {
                            page.data.forEach((user, index) => {
                                if (updateSet.has(user.id!)) {
                                    page.data![index] = { ...user, ...data };
                                }
                            });
                        }
                    });
                }
            }),

            bulkDeleteUsers: (userIds) => set((state) => {
                // Create a set for faster lookups
                const deleteSet = new Set(userIds);

                // Remove from flat users array
                state.users = state.users.filter(user => !deleteSet.has(user.id!));

                // Also remove from infiniteQueryData if it exists
                if (state.infiniteQueryData?.pages.length) {
                    state.infiniteQueryData.pages.forEach(page => {
                        if (page.data) {
                            page.data = page.data.filter(user => !deleteSet.has(user.id!));
                        }
                    });
                }
            }),
        },
    }))
);

export default useUsersStore;
