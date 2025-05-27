'use client';

import useReportStore, {ReportDataWrapper} from "@/app/admin/moderation/reports/useReportStore";
import {InfiniteData, useInfiniteQuery, UseInfiniteQueryOptions, useMutation} from "@tanstack/react-query";
import {
    deleteReportMutation,
    updateReportStatusMutation
} from "@/api/client/@tanstack/react-query.gen";
import {getNextPageParam} from "@/lib/utils";
import {useEffect} from "react";
import {ResponseMetadata} from "@/api/client";

export interface ModerationProps {
    options: UseInfiniteQueryOptions
}

export const useModeration = ({options} : ModerationProps) => {
    const {actions} = useReportStore()
    const queryKey = Array.isArray(options.queryKey) ? options.queryKey : [options.queryKey].filter(k => k !== undefined);

    const {data, isFetchingNextPage, hasNextPage, fetchNextPage} = useInfiniteQuery({
        ...options,
        queryKey: queryKey,
        getNextPageParam: (lastPage) => {
            return getNextPageParam(lastPage as { metadata: ResponseMetadata });
        },
        initialPageParam: 0,
    })

    useEffect(() => {
        if (data) {
            actions.setInfiniteQueryData(data as InfiniteData<ReportDataWrapper>);
        }
    }, [data, actions]);

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
        totalPages: data?.pages[0].metadata?.pagination || 0,
        updateReport,
        deleteReport,
        isUpdatingReport,
        isDeletingReport,
    }
}

