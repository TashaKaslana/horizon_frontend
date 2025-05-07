import {deleteNotification, getMyAllNotifications, markNotificationAsRead} from "@/api/notificationApi";
import {RestApiResponse} from "@/types/api";
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import {useNotificationStore} from "@/app/(home)/notifications/store/useNotificationStore";
import {useEffect} from "react";
import {Notification} from "@/types/Notification";

export const useNotification = () => {
    const {setNotifications, selectedNotificationType, markTabAsRead} = useNotificationStore()

    const {data, isFetchingNextPage, fetchNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['my-notifications', {type: selectedNotificationType}],
        queryFn: async () => {
            return await getMyAllNotifications({
                page: 0,
                size: 10,
                type: selectedNotificationType ? selectedNotificationType : undefined
            })
        },
        getNextPageParam: (lastPage: Omit<RestApiResponse<Notification[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0
    })

    const deleteMutation = useMutation(({
        mutationFn: async (postId: string) => {
            await deleteNotification(postId);
        },
        onSuccess: (_data, postId) => {
            //TODO: delete notification from the store
        }
    }))

    const markAsReadMutation = useMutation(({
        mutationFn: async (postId: string) => {
            await markNotificationAsRead(postId);
        },
        onSuccess: (_data, postId) => {

        }
    }))

    useEffect(() => {
        const notifications = data?.pages.flatMap((page) => page.data);
        if (notifications) {
            setNotifications(notifications);
        }
    }, [data?.pages, setNotifications]);

    return {
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    }
}