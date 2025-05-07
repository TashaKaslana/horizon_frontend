import {
    deleteNotification,
    getMyAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadAllNotifications,
    unreadNotification, dismissAllNotifications
} from "@/api/notificationApi"
import {RestApiResponse} from "@/types/api"
import {useInfiniteQuery, useMutation} from "@tanstack/react-query"
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
        markAllAsRead
    } = useNotificationStore()

    const {data, isFetchingNextPage, fetchNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['my-notifications'],
        queryFn: async () => {
            return await getMyAllNotifications({
                page: 0,
                size: 10,
                type: activeTab !== 'all' ? activeTab : undefined
            })
        },
        getNextPageParam: (lastPage: Omit<RestApiResponse<Notification[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined
        },
        initialPageParam: 0
    })

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
            setNotifications(notifications)
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
        handleDeleteNotification,
        handleToggleReadStatus,
        handleToggleAllReadStatus,
        handleDismissAllNotifications
    }
}
