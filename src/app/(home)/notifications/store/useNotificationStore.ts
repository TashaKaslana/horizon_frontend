import {create} from "zustand"
import {GroupType, Notification, NotificationCount} from "@/types/Notification"

type NotificationStore = {
    notifications: Notification[]
    selectedNotificationType: string
    setSelectedNotificationType: (type: string) => void
    allCount: number
    allUnreadCount: number
    groupedStats: Record<GroupType, NotificationCount>
    setNotificationStatistics: (payload: {
        allCount: number
        allUnreadCount: number
        stats: Record<GroupType, NotificationCount>
    }) => void
    searchQuery: string
    activeTab: string
    readFilter: string
    showSearch: boolean
    setNotifications: (notifications: Notification[]) => void
    setSearchQuery: (query: string) => void
    setActiveTab: (tab: string) => void
    setReadFilter: (filter: string) => void
    toggleSearch: () => void
    markAllAsRead: (isRead: boolean) => void
    markTabAsRead: (isRead: boolean) => void
    clearAllNotifications: () => void
    updateNotificationReadStatus: (id: string, isRead: boolean) => void
    deleteNotification: (id: string) => void
    updateNotification: (id: string, updates: Partial<Notification>) => void
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
    notifications: [],
    selectedNotificationType: 'all',
    setSelectedNotificationType: (type) => set({selectedNotificationType: type}),
    searchQuery: "",
    activeTab: "all",
    readFilter: "all",
    showSearch: false,

    allCount: 0,
    allUnreadCount: 0,
    groupedStats: {
        like: {count: 0, unreadCount: 0},
        follow: {count: 0, unreadCount: 0},
        comment: {count: 0, unreadCount: 0},
        mention: {count: 0, unreadCount: 0},
        post: {count: 0, unreadCount: 0},
        system: {count: 0, unreadCount: 0},
    },

    setNotifications: (notifications) => set({notifications}),
    setSearchQuery: (query) => set({searchQuery: query}),
    setActiveTab: (tab) => set({activeTab: tab}),
    setReadFilter: (filter) => set({readFilter: filter}),
    toggleSearch: () => set((state) => ({showSearch: !state.showSearch})),

    markAllAsRead: (isRead: boolean) =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({...n, isRead: isRead})),
        })),

    markTabAsRead: (isRead: boolean) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                state.activeTab === "all" || n.type === state.activeTab
                    ? {...n, isRead: isRead}
                    : n
            ),
        })),

    clearAllNotifications: () => set({notifications: []}),

    updateNotificationReadStatus: (id, isRead) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? {...n, isRead} : n
            ),
        })),

    deleteNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    updateNotification: (id, updates) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? {...n, ...updates} : n
            ),
        })),

    setNotificationStatistics: ({allCount, allUnreadCount, stats}) =>
        set(() => ({
            allCount,
            allUnreadCount,
            groupedStats: stats,
        })),
}))
