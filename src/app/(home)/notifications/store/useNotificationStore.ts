import { create } from "zustand"
import { Notification } from "@/types/Notification"

type NotificationStore = {
    notifications: Notification[]
    selectedNotificationType: string
    setSelectedNotificationType: (type : string) => void
    searchQuery: string
    activeTab: string
    readFilter: string
    showSearch: boolean
    setNotifications: (notifications: Notification[]) => void
    setSearchQuery: (query: string) => void
    setActiveTab: (tab: string) => void
    setReadFilter: (filter: string) => void
    toggleSearch: () => void
    markAllAsRead: () => void
    markTabAsRead: () => void
    clearAllNotifications: () => void
    updateNotificationReadStatus: (id: string, isRead: boolean) => void
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
    notifications: [],
    selectedNotificationType: 'all',
    setSelectedNotificationType: (type) => set({ selectedNotificationType: type}),
    searchQuery: "",
    activeTab: "all",
    readFilter: "all",
    showSearch: false,

    setNotifications: (notifications) => set({ notifications }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setReadFilter: (filter) => set({ readFilter: filter }),
    toggleSearch: () => set((state) => ({ showSearch: !state.showSearch })),

    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),

    markTabAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                state.activeTab === "all" || n.type === state.activeTab
                    ? { ...n, isRead: true }
                    : n
            ),
        })),

    clearAllNotifications: () => set({ notifications: [] }),

    updateNotificationReadStatus: (id, isRead) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, isRead } : n
            ),
        })),
}))
