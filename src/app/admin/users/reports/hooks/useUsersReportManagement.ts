import useUsersReportStore from "@/app/admin/users/reports/stores/useUsersReportStore";
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import {getNextPageParam} from "@/lib/utils";
import {
    deleteReportMutation,
    searchReportsInfiniteOptions,
    updateReportStatusMutation
} from "@/api/client/@tanstack/react-query.gen";
import {useEffect} from "react";

export const useUsersReportManagement = () => {
    const {actions} = useUsersReportStore()

    const {data, isLoading, isFetchingNextPage, fetchNextPage} = useInfiniteQuery({
        ...searchReportsInfiniteOptions({
            query: {
                page: 0,
                size: 10,
                sort: ["createdAt", "desc"],
                itemType: 'USER',
            },
        }),
        getNextPageParam: (lastPage) => {
            return getNextPageParam(lastPage);
        },
        initialPageParam: 0,
    })

    useEffect(() => {
        if (data) {
            actions.setInfiniteQueryData(data);

        }
    }, [actions, data]);

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
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        totalPages: data?.pages[0].metadata?.pagination?.totalPages || 0,
        updateReport,
        isUpdatingReport,
        deleteReport,
        isDeletingReport,
    }
}