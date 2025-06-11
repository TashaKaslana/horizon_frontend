import {getNextPageParam} from "@/lib/utils";
import useAdminNotificationStore from "../stores/useAdminNotificationStore";
import {
    bulkDeleteNotificationsMutation,
    bulkUpdateNotificationsMutation,
    getAdminNotificationOverviewOptions,
    getAllNotificationsInfiniteOptions, getNotificationTrendsOptions
} from "@/api/client/@tanstack/react-query.gen";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {useEffect} from "react";
import {toast} from "sonner";
import {BulkAdminNotificationUpdateRequest} from "@/api/client";

export const useAdminNotification = (timeRange: number = 30) => {
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

    const {data: overviewData, isLoading: isOverviewLoading} = useQuery({
        ...getAdminNotificationOverviewOptions(),
    })

    useEffect(() => {
        if (!overviewData?.data) return;
        actions.setOverviewData(overviewData?.data ?? []);
    }, [actions, overviewData?.data]);

    const {data: chartData, isLoading: isChartLoading} = useQuery({
        ...getNotificationTrendsOptions({
            query: {
                days: timeRange
            }
        })
    })

    useEffect(() => {
        if (!chartData?.data) return;
        actions.setChartData(chartData?.data ?? []);
    }, [actions, chartData?.data]);

    const {
        mutate: bulkUpdateNotifications,
        isPending: isBulkUpdatePending
    } = useMutation({
        ...bulkUpdateNotificationsMutation(),
        onSuccess: (data) => {
            if (data.data !== undefined) {
                data.data?.forEach((notification) => actions.updateNotifications(notification))
                toast.success("Notifications updated successfully");
            }
        },
        onError: (error) => {
            toast.error(`Failed to update notifications: ${error.message}`);
        },
    })

    const updateNotifications = async (request: BulkAdminNotificationUpdateRequest) => {
        return bulkUpdateNotifications({
            body: request,
        });
    }

    const {
        mutate: bulkDeleteNotifications,
        isPending: isBulkDeletePending
    } = useMutation({
        ...bulkDeleteNotificationsMutation(),
        onSuccess: (_, variables) => {
            if (variables.body !== undefined) {
                variables.body?.notificationIds?.forEach((notificationId) => actions.removeNotifications(notificationId))
                toast.success("Notifications deleted successfully");
            }
        },
        onError: (error) => {
            toast.error(`Failed to delete notifications: ${error.message}`);
        },
    })

    const deleteNotifications = async (notificationIds: string[]) => {
        return bulkDeleteNotifications({
            body: {
                notificationIds,
            },
        });
    }

    return {
        notificationListData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,

        overviewData: overviewData?.data ?? [],
        isOverviewLoading,
        chartData: chartData?.data ?? [],
        isChartLoading,

        updateNotifications,
        isBulkUpdatePending,
        deleteNotifications,
        isBulkDeletePending,
    };
}