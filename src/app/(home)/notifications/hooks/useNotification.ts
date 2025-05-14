import {
    deleteNotification,
    getMyAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadAllNotifications,
    unreadNotification, dismissAllNotifications, getNotificationStatistic
} from "@/api/notificationApi"
import {RestApiResponse} from "@/types/api"
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query"
import {useNotificationStore} from "@/app/(home)/notifications/store/useNotificationStore"
import {useEffect} from "react"
import {GroupType, Notification} from "@/types/Notification"

export const useNotification = () => {
    const {
        setNotifications,
        activeTab,
        markTabAsRead,
        deleteNotification: deleteNotificationStore,
        updateNotification,
        markAllAsRead,
        setAllCount,
        setAllUnreadCount,
        setGroupedStats,
        groupedStats
    } = useNotificationStore()

    const {data, isFetchingNextPage, fetchNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['my-notifications', activeTab],
        queryFn: async ({pageParam = 0}) => {
            return await getMyAllNotifications({
                page: pageParam,
                size: 2,
                type: activeTab !== 'all' ? activeTab : undefined
            })
        },
        getNextPageParam: (lastPage: Omit<RestApiResponse<Notification[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined
        },
        initialPageParam: 0
    })

    const {data: statisticsData} = useQuery({
        queryKey: ['my-notifications-statistic'],
        queryFn: async () => {
            return await getNotificationStatistic()
        }
    })

    const statistics = statisticsData?.data

    useEffect(() => {
        if (statistics) {
            setAllCount(statistics?.allCount ?? 0)
            setAllUnreadCount(statistics?.allUnreadCount ?? 0)
            setGroupedStats(statistics?.stats ?? {
                like: {count: 0, unreadCount: 0},
                follow: {count: 0, unreadCount: 0},
                comment: {count: 0, unreadCount: 0},
                mention: {count: 0, unreadCount: 0},
                post: {count: 0, unreadCount: 0},
                system: {count: 0, unreadCount: 0},
            })
        }
    }, [setAllCount, setAllUnreadCount, setGroupedStats, statistics]);
    
    const deleteMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            await deleteNotification(notificationId)
        },
        onSuccess: (_data, notificationId) => {
            deleteNotificationStore(notificationId)
            setAllCount(prev => prev - 1)
            //TODO:need way to check if is read
            setGroupedStats(prev => ({
                ...prev,
                [activeTab as GroupType]: {
                    ...prev[activeTab as GroupType],
                    count: prev[activeTab as GroupType].count - 1
                }
            }))
        }
    })

    const markAsReadMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            await markNotificationAsRead(notificationId)
        },
        onSuccess: (_data, notificationId) => {
            updateNotification(notificationId, {isRead: true})
            setAllUnreadCount(prev => prev - 1)
            setGroupedStats(prev => ({
                ...prev,
                [activeTab as GroupType]: {
                    ...prev[activeTab as GroupType],
                    unreadCount: prev[activeTab as GroupType].unreadCount - 1
                }
            }))
        }
    })

    const unreadMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            await unreadNotification(notificationId)
        },
        onSuccess: (_data, notificationId) => {
            updateNotification(notificationId, {isRead: false})
            setAllUnreadCount(prev => prev + 1)
            setGroupedStats(prev => ({
                ...prev,
                [activeTab as GroupType]: {
                    ...prev[activeTab as GroupType],
                    unreadCount: prev[activeTab as GroupType].unreadCount + 1
                }
            }))
        }
    })

    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            await markAllNotificationsAsRead({
                type: activeTab !== 'all' ? activeTab : undefined
            })
        },
        onSuccess: () => {
            markTabAsRead(true)
            markAllAsRead(true)
            setAllUnreadCount(prev => prev - (groupedStats[activeTab as GroupType]?.unreadCount ?? 0))
            setAllCount(prev => prev - (groupedStats[activeTab as GroupType]?.unreadCount ?? 0))
            setGroupedStats(prev => ({
                ...prev,
                [activeTab as GroupType]: {
                    ...prev[activeTab as GroupType],
                    unreadCount: 0
                }
            }))
        }
    })

    const unreadAllMutation = useMutation({
        mutationFn: async () => {
            await unreadAllNotifications({
                type: activeTab !== 'all' ? activeTab : undefined
            })
        },
        onSuccess: () => {
            markAllAsRead(false)
            setAllUnreadCount(prev => prev + (groupedStats[activeTab as GroupType]?.unreadCount ?? 0))
            setAllCount(prev => prev - (groupedStats[activeTab as GroupType]?.unreadCount ?? 0))
            setGroupedStats(prev => ({
                ...prev,
                [activeTab as GroupType]: {
                    ...prev[activeTab as GroupType],
                    unreadCount: 0
                }
            }))
        }
    })

    const dismissAllMutations = useMutation({
        mutationFn: async () => {
            await dismissAllNotifications({type: activeTab})
        },
        onSuccess: () => {
            markTabAsRead(false)
            markAllAsRead(false)
            setAllCount(prev => prev - (groupedStats[activeTab as GroupType]?.count ?? 0))
            setAllUnreadCount(prev => prev - (groupedStats[activeTab as GroupType]?.unreadCount ?? 0))
            setGroupedStats(prev => ({
                ...prev,
                [activeTab as GroupType]: {count: 0, unreadCount: 0},
            }))
        }
    })

    useEffect(() => {
        const notifications = data?.pages.flatMap((page) => page.data)

        if (notifications) {
            const uniqueNotifications = Array.from(
                new Map(notifications.map(n => [n.id, n])).values()
            )
            setNotifications(uniqueNotifications)
        }
    }, [data?.pages, setNotifications])


    const handleToggleReadStatus = (notificationId: string, currentReadStatus: boolean) => {
        if (currentReadStatus) {
            unreadMutation.mutate(notificationId)
        } else {
            markAsReadMutation.mutate(notificationId)
        }
    }

    const handleDeleteNotification = (notificationId: string) => {
        deleteMutation.mutate(notificationId)
    }

    const handleToggleAllReadStatus = (markAsRead: boolean) => {
        if (markAsRead) {
            markAllAsReadMutation.mutate()
        } else {
            unreadAllMutation.mutate()
        }
    }

    const handleDismissAllNotifications = () => {
        dismissAllMutations.mutate()
    }

    return {
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        statistics,
        handleDeleteNotification,
        handleToggleReadStatus,
        handleToggleAllReadStatus,
        handleDismissAllNotifications
    }
}
