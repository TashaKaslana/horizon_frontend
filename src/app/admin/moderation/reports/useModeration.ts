'use client';

import {useReportStore, ReportDataWrapper} from "@/app/admin/moderation/reports/useReportStore";
import {InfiniteData, useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {
    bulkDeleteReportsMutation, bulkUpdateReportsMutation,
    deleteReportMutation, getAllReportsInfiniteOptions,
    getCommentModerationOverviewOptions, getDailyPendingAndResolvedReportsOptions,
    getModerationOverviewOptions,
    getPostModerationOverviewOptions, getUserModerationOverviewOptions, searchReportsInfiniteOptions,
    updateReportStatusMutation
} from "@/api/client/@tanstack/react-query.gen";
import {getNextPageParam} from "@/lib/utils";
import {useEffect} from "react";
import {toast} from "sonner";
import {BulkReportUpdateRequest} from "@/api/client";

export const useModeration = (timeRange = 30) => {
    const {actions} = useReportStore()
    const {currentType} = useReportStore()

    const {data, isFetchingNextPage, hasNextPage, fetchNextPage} = useInfiniteQuery({
            ...(
                currentType === 'ALL' ? getAllReportsInfiniteOptions() :
                    searchReportsInfiniteOptions({
                        query: {
                            page: 0,
                            size: 10,
                            itemType: currentType,
                        }
                    })
            ),
            getNextPageParam: (lastPage) => {
                return getNextPageParam(lastPage);
            },
            initialPageParam: 0,
        }
    )

    useEffect(() => {
        if (data) {
            actions.setInfiniteQueryData(data as InfiniteData<ReportDataWrapper>);
        }
    }, [data, actions]);

    const {data: overview, isLoading: isOverviewLoading} = useQuery(({
        ...getModerationOverviewOptions(),
        enabled: currentType === 'ALL',
    }))

    useEffect(() => {
        if (overview?.data) {
            actions.setOverview(overview.data);
        }
    }, [overview?.data, actions]);

    const {data: userOverview, isLoading: isUserOverviewLoading} = useQuery(({
        ...getUserModerationOverviewOptions(),
        enabled: currentType === 'USER'
    }))

    useEffect(() => {
        if (userOverview?.data) {
            actions.setUserOverview(userOverview.data);
        }
    }, [userOverview?.data, actions]);

    const {data: postOverview, isLoading: isPostOverviewLoading} = useQuery(({
        ...getPostModerationOverviewOptions(),
        enabled: currentType === 'POST'
    }))

    useEffect(() => {
        if (postOverview?.data) {
            actions.setPostOverview(postOverview.data);
        }
    }, [postOverview?.data, actions]);

    const {data: commentOverview, isLoading: isCommentOverviewLoading} = useQuery(({
        ...getCommentModerationOverviewOptions(),
        enabled: currentType === 'COMMENT'
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
                itemType: currentType !== 'ALL' ? currentType : undefined,
            }
        })
    })

    useEffect(() => {
        if (dailyData?.data) {
            if (currentType === "ALL") {
                actions.setChartData(dailyData.data);
            } else if (currentType === 'USER') {
                actions.setUserChartData(dailyData.data);
            } else if (currentType === 'POST') {
                actions.setPostChartData(dailyData.data);
            } else if (currentType === 'COMMENT') {
                actions.setCommentChartData(dailyData.data);
            }
        }
    }, [dailyData?.data, actions, currentType]);

    const {mutate: updateReportMutationFn, isPending: isUpdatingReport} = useMutation({
        ...updateReportStatusMutation(),
        onSuccess: (updatedReport) => {
            if (updatedReport.data) {
                actions.updateReport(updatedReport.data);
            }
            toast.success("Report status updated successfully.");
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
            toast.success("Report deleted successfully.");
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

    const {mutateAsync: bulkDeleteReports, isPending: isBulkDeletingReports} = useMutation({
        ...bulkDeleteReportsMutation(),
        onSuccess: (_, variables) => {
            if (variables.body) {
                variables.body?.reportIds?.forEach(reportId => {
                    actions.removeReport(reportId);
                });
            }
            toast.success("Reports deleted successfully.");
        },
        onError: (error) => {
            console.error("Failed to bulk delete reports:", error);
            toast.error("Failed to bulk delete reports.");
        },
    })

    const bulkDeleteReportsAction = (reportIds: string[]) => {
        return bulkDeleteReports({body: {reportIds}});
    }

    const {mutateAsync: bulkUpdateReports, isPending: isBulkUpdatingReports} = useMutation({
        ...bulkUpdateReportsMutation(),
        onSuccess: (updatedReports) => {
            if (updatedReports.data) {
                updatedReports.data.forEach(report => {
                    actions.updateReport(report);
                });
            }
            toast.success("Reports updated successfully.");
        },
        onError: (error) => {
            console.error("Failed to bulk update reports:", error);
            toast.error("Failed to bulk update reports.");
        },
    });

    const bulkUpdateReportsAction = (request: BulkReportUpdateRequest) => {
        return bulkUpdateReports({body: request});
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

        isBulkDeletingReports,
        bulkDeleteReportsAction,

        isBulkUpdatingReports,
        bulkUpdateReportsAction,
    }
}
