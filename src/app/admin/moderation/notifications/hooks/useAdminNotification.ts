import { getNextPageParam } from "@/lib/utils";
import useAdminNotificationStore from "../stores/useAdminNotificationStore";
import {getAllNotificationsInfiniteOptions} from "@/api/client/@tanstack/react-query.gen";
import {useInfiniteQuery} from "@tanstack/react-query";
import {useEffect} from "react";

export const useAdminNotification = () => {
    const {actions} = useAdminNotificationStore();

    const {
        data: notificationListData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        ...getAllNotificationsInfiniteOptions({
            query: {
                page: 0,
                size: 10,
                sort: ["createdAt", "desc"],
            },
        }),
        getNextPageParam: (lastPage) => getNextPageParam(lastPage),
        initialPageParam: 0
    });

    useEffect(() => {
        actions.setInfiniteQueryData(notificationListData);
    }, [actions, notificationListData]);

    return {
        notificationListData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    };
}