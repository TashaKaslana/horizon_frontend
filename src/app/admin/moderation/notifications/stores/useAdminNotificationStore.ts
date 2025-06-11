'use client'

import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import {AdminNotificationDto, DailyCountDto, OverviewStatistic} from "@/api/client";

export interface NotificationsPage {
    data?: AdminNotificationDto[];
}

interface NotificationsState {
    notifications: AdminNotificationDto[];
    selectedNotifications: AdminNotificationDto | null;
    infiniteQueryData: InfiniteData<NotificationsPage> | null;
    overviewData: OverviewStatistic[];
    chartData: DailyCountDto[]
    actions: {
        setInfiniteQueryData: (data: InfiniteData<NotificationsPage>) => void;
        setSelectedNotifications: (notifications: AdminNotificationDto | null) => void;
        setOverviewData: (data: OverviewStatistic[]) => void;
        setChartData: (data: DailyCountDto[]) => void;
        clearAllData: () => void;
        addNotifications: (notifications: AdminNotificationDto) => void;
        updateNotifications: (notificationsUpdate: Partial<AdminNotificationDto>) => void;
        removeNotifications: (notificationsId: string) => void;
        setNotifications: (notifications: AdminNotificationDto[]) => void;
    };
}

const useAdminNotificationsStore = create<NotificationsState>()(
    immer((set) => ({
        notifications: [],
        infiniteQueryData: null,
        selectedNotifications: null,
        overviewData: [],
        chartData: [],
        actions: {
            setInfiniteQueryData: (data) =>
                set((state) => {
                    state.infiniteQueryData = data;
                    state.notifications = data?.pages?.flatMap((page: NotificationsPage) => page.data ?? []) ?? [];
                }),

            setSelectedNotifications: (notifications) =>
                set((state) => {
                    state.selectedNotifications = notifications;
                }),

            setOverviewData: (data) =>
                set((state) => {
                    state.overviewData = data;
                }),

            setChartData: (data) =>
                set((state) => {
                    state.chartData = data;
                }),

            addNotifications: (newNotifications) =>
                set((state) => {
                    state.notifications.unshift(newNotifications);
                    if (state.infiniteQueryData) {
                        const firstPage = state.infiniteQueryData.pages[0];
                        if (firstPage) {
                            firstPage.data = [newNotifications, ...(firstPage.data ?? [])];
                        }
                    }
                }),

            updateNotifications: (notificationsUpdate) =>
                set((state) => {
                    state.notifications = state.notifications.map((notification) => {
                        if (notification.id === notificationsUpdate.id) {
                            return { ...notification, ...notificationsUpdate };
                        }
                        return notification;
                    });
                    if (state.selectedNotifications?.id === notificationsUpdate.id) {
                        state.selectedNotifications = { ...state.selectedNotifications, ...notificationsUpdate };
                    }
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map((page) => ({
                            ...page,
                            data: (page.data ?? []).map((p) => {
                                if (p.id === notificationsUpdate.id) {
                                    return { ...p, ...notificationsUpdate };
                                }
                                return p;
                            }),
                        }));
                    }
                }),

            removeNotifications: (notificationsId) =>
                set((state) => {
                    state.notifications = state.notifications.filter((p) => p.id !== notificationsId);
                    if (state.selectedNotifications?.id === notificationsId) {
                        state.selectedNotifications = null;
                    }
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages
                            .map((page) => ({
                                ...page,
                                data: (page.data ?? []).filter((p) => p.id !== notificationsId),
                            }))
                            .filter((page) => (page.data?.length ?? 0) > 0);
                    }
                }),

            setNotifications: (newNotifications) =>
                set((state) => {
                    state.notifications = newNotifications;
                    if (state.infiniteQueryData) {
                        const remainingNotifications = [...newNotifications];
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageNotificationsCount = page.data?.length || 0;
                            const notificationsForThisPage = remainingNotifications.splice(0, pageNotificationsCount);
                            return {
                                ...page,
                                data: notificationsForThisPage
                            };
                        }).filter(page => page.data && page.data.length > 0);

                        if (newNotifications.length > 0 && state.infiniteQueryData.pages.length === 0) {
                            state.infiniteQueryData.pages = [{ data: newNotifications }];
                            state.infiniteQueryData.pageParams = [0];
                        }
                    }
                }),

            clearAllData: () =>
                set((state) => {
                    state.notifications = [];
                    state.infiniteQueryData = null;
                    state.selectedNotifications = null;
                }),
        },
    }))
);

export default useAdminNotificationsStore;

