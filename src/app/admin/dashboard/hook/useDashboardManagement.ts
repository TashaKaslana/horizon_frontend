'use client';

import {useQuery} from "@tanstack/react-query";
import {
    getDashboardOverviewOptions,
    getPostsPerDayOptions,
    getUsersPerDayOptions,
    getCommentsPerDayOptions
} from "@/api/client/@tanstack/react-query.gen";
import {useEffect} from "react";
import useDashboardStore from "@/app/admin/dashboard/store/useDashboardStore";

const useDashboardManagement = (type?: "User" | "Post" | "Comment", timeRange: number = 30) => {
    const {actions} = useDashboardStore();
    
    const {data: overviewData, isLoading: isOverviewLoading} = useQuery({
        ...getDashboardOverviewOptions()
    })

    useEffect(() => {
        if (overviewData?.data) {
            actions.setOverviewData(overviewData.data || []);
        }
    }, [actions, overviewData?.data]);

    const {data: userChartData, isLoading: isUserChartLoading} = useQuery({
        ...getUsersPerDayOptions({
            query: {
                days: timeRange
            }
        }),
        enabled: type === "User" || type === undefined
    })

    useEffect(() => {
        if (userChartData?.data) {
            actions.setUserChartData(userChartData.data);
        }
    }, [actions, userChartData?.data]);

    const {
        data: postChartData,
        isLoading: isPostChartLoading
    } = useQuery({
        ...getPostsPerDayOptions({
            query: {
                days: timeRange
            }
        }),
        enabled: type === "Post" || type === undefined
    })

    useEffect(() => {
        if (postChartData?.data) {
            actions.setPostChartData(postChartData.data);
        }
    }, [actions, postChartData?.data]);

    const {data: commentChartData, isLoading: isCommentChartLoading} = useQuery({
        ...getCommentsPerDayOptions({
            query: {
                days: timeRange
            }
        }),
        enabled: type === "Comment" || type === undefined
    })

    useEffect(() => {
        if (commentChartData?.data) {
            actions.setCommentChartData(commentChartData.data);
        }
    }, [actions, commentChartData?.data]);

    return {
        overviewData,
        isOverviewLoading,

        userChartData,
        isUserChartLoading,

        postChartData,
        isPostChartLoading,

        commentChartData,
        isCommentChartLoading
    }
}

export default useDashboardManagement

