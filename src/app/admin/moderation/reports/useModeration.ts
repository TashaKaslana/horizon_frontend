'use client';

import {useReportStore, ReportDataWrapper} from "@/app/admin/moderation/reports/useReportStore";
import {InfiniteData, useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {
    deleteReportMutation, getAllReportsInfiniteOptions,
    getCommentModerationOverviewOptions, getDailyPendingAndResolvedReportsOptions,
    getModerationOverviewOptions,
    getPostModerationOverviewOptions, getUserModerationOverviewOptions, searchReportsInfiniteOptions,
    updateReportStatusMutation
} from "@/api/client/@tanstack/react-query.gen";
import {getNextPageParam} from "@/lib/utils";
import {useEffect} from "react";

export interface ModerationProps {
    timeRange?: number,
    type?: 'USER' | 'POST' | 'COMMENT',
    isFull?: boolean,
}

export const useModeration = ({type, timeRange, isFull}: ModerationProps) => {
    const {actions} = useReportStore()

    const {data, isFetchingNextPage, hasNextPage, fetchNextPage} = useInfiniteQuery({
        ...(
            isFull ? getAllReportsInfiniteOptions() :
            searchReportsInfiniteOptions({
                query: {
                    page: 0,
                    size: 10,
                    itemType: type || undefined,
                }
            })
        ),
        getNextPageParam: (lastPage) => {
            return getNextPageParam(lastPage);
        },
        initialPageParam: 0,
    })

    useEffect(() => {
        if (data) {
            actions.setInfiniteQueryData(data as InfiniteData<ReportDataWrapper>);
        }
    }, [data, actions]);

    const {data: overview, isLoading: isOverviewLoading} = useQuery(({
        ...getModerationOverviewOptions(),
        enabled: type === undefined,
    }))

    useEffect(() => {
        if (overview?.data) {
            actions.setOverview(overview.data);
        }
    }, [overview?.data, actions]);

    const {data: userOverview, isLoading: isUserOverviewLoading} = useQuery(({
        ...getUserModerationOverviewOptions(),
        enabled: type === 'USER'
    }))

    useEffect(() => {
        if (userOverview?.data) {
            actions.setUserOverview(userOverview.data);
        }
    }, [userOverview?.data, actions]);

    const {data: postOverview, isLoading: isPostOverviewLoading} = useQuery(({
        ...getPostModerationOverviewOptions(),
        enabled: type === 'POST'
    }))

    useEffect(() => {
        if (postOverview?.data) {
            actions.setPostOverview(postOverview.data);
        }
    }, [postOverview?.data, actions]);

    const {data: commentOverview, isLoading: isCommentOverviewLoading} = useQuery(({
        ...getCommentModerationOverviewOptions(),
        enabled: type === 'COMMENT'
    }))

    useEffect(() => {
        if (commentOverview?.data) {
            actions.setCommentOverview(commentOverview.data);
        }
    }, [commentOverview?.data, actions]);

    const {data: dailyData, isLoading: isDailyDataLoading} = useQuery({
        ...getDailyPendingAndResolvedReportsOptions({
            query: {
                days: timeRange ?? 30,
                itemType: type || undefined,
            }
        })
    })

    useEffect(() => {
        if (dailyData?.data) {
            if (type === undefined) {
                actions.setChartData(dailyData.data);
            } else if (type === 'USER') {
                actions.setUserChartData(dailyData.data);
            } else if (type === 'POST') {
                actions.setPostChartData(dailyData.data);
            } else if (type === 'COMMENT') {
                actions.setCommentChartData(dailyData.data);
            }
        }
    }, [dailyData?.data, actions, type]);

    const {mutate: updateReportMutationFn, isPending: isUpdatingReport} = useMutation({
        ...updateReportStatusMutation(),
        onSuccess: (updatedReport) => {
            if (updatedReport.data) {
                actions.updateReport(updatedReport.data);
            }
        },
        onError: (error) => {
            console.error("Failed to update report status:", error);
        },
    })

    const {mutate: deleteReportMutationFn, isPending: isDeletingReport} = useMutation({
        ...deleteReportMutation(),
        onSuccess: (_, variables) => {
            if (variables.data) {
                actions.removeReport(variables.path.reportId);
            }
        },
        onError: (error) => {
            console.error("Failed to delete report:", error);
        },
    });

    const updateReport = (
        reportId: string,
        status: "PENDING" | "REVIEWED_APPROVED" | "REVIEWED_REJECTED" | "ACTIONTAKEN_CONTENTREMOVED" |
            "ACTIONTAKEN_USERWARNED" | "ACTIONTAKEN_USERBANNED" | "RESOLVED"
    ) => {
        updateReportMutationFn({
                path: {reportId},
                body: status
            }
        );
    }

    const deleteReport = (reportId: string) => {
        deleteReportMutationFn({
                path: {reportId},
            }
        );
    }

    return {
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        totalPages: data?.pages[0].metadata?.pagination?.totalPages || 0,
        updateReport,
        deleteReport,
        isUpdatingReport,
        isDeletingReport,

        isOverviewLoading,
        isUserOverviewLoading,
        isPostOverviewLoading,
        isCommentOverviewLoading,

        isDailyDataLoading,
    }
}

