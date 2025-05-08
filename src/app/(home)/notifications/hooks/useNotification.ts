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
import {Notification} from "@/types/Notification"

export const useNotification = () => {
    const {
        setNotifications,
        activeTab,
        markTabAsRead,
        deleteNotification: deleteNotificationStore,
        updateNotification,
        markAllAsRead,
        setNotificationStatistics,
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

    //TODO: add update statistics
    const {data: statisticsData} = useQuery({
        queryKey: ['my-notifications-statistic'],
        queryFn: async () => {
            return await getNotificationStatistic()
        }
    })

    const statistics = statisticsData?.data

    useEffect(() => {
        if (statistics) {
            setNotificationStatistics({
                allCount: statistics.allCount,
                allUnreadCount: statistics.allUnreadCount,
                stats: statistics.stats,
            });
        }
    }, [setNotificationStatistics, statistics]);
    
    const deleteMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            await deleteNotification(notificationId)
        },
        onSuccess: (_data, notificationId) => {
            deleteNotificationStore(notificationId)
        }
    })

    const markAsReadMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            await markNotificationAsRead(notificationId)
        },
        onSuccess: (_data, notificationId) => {
            updateNotification(notificationId, {isRead: true})
        }
    })

    const unreadMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            await unreadNotification(notificationId)
        },
        onSuccess: (_data, notificationId) => {
            updateNotification(notificationId, {isRead: false})
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
        }
    })

    const dismissAllMutations = useMutation({
        mutationFn: async () => {
            await dismissAllNotifications({type: activeTab})
        },
        onSuccess: () => {
            markTabAsRead(false)
            markAllAsRead(false)
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
