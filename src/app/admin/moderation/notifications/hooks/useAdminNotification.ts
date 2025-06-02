import { getNextPageParam } from "@/lib/utils";
import useAdminNotificationStore from "../stores/useAdminNotificationStore";
import {
    getAdminNotificationOverviewOptions,
    getAllNotificationsInfiniteOptions, getNotificationTrendsOptions
} from "@/api/client/@tanstack/react-query.gen";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {useEffect} from "react";

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
    };
}