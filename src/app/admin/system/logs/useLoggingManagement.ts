import useLoggingStore from "@/app/admin/system/logs/useLoggingStore";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {
    getAllLogEntriesInfiniteOptions,
    getDailyErrorLogsOptions,
    getLogOverviewOptions,
    bulkDeleteLogEntriesMutation
} from "@/api/client/@tanstack/react-query.gen";
import {getNextPageParam} from "@/lib/utils";
import {useEffect} from "react";
import {toast} from "sonner";

export const useLoggingManagement = (
    severities?: ("INFO" | "WARNING" | "ERROR" | "CRITICAL")[],
    days: number = 30
) => {
    const {actions} = useLoggingStore();

    const {data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage} = useInfiniteQuery({
        ...getAllLogEntriesInfiniteOptions({
            query: {
                page: 0,
                size: 10,
                sort: ["createdAt", "desc"],
                severities: severities
            },
        }),
        getNextPageParam: (lastPage) => {
            console.log("lastPage for next page param:", lastPage);
            return getNextPageParam(lastPage)
        },
        initialPageParam: 0,
    })

    useEffect(() => {
        if (!data) return;
        actions.setInfiniteQueryData(data);
        console.log("useLoggingManagement: setInfiniteQueryData", data);
    }, [actions, data]);

    const {data: logOverview, isLoading: isLogOverviewLoading} = useQuery({
        ...getLogOverviewOptions()
    })

    useEffect(() => {
        if (logOverview?.data) {
            actions.setLogOverviewData(logOverview.data);
        }
    }, [actions, logOverview?.data]);

    const {data: logChartData, isLoading: isLogChartLoading} = useQuery({
        ...getDailyErrorLogsOptions({
            query: {
                days: days,
            }
        })
    })

    useEffect(() => {
        if (logChartData?.data) {
            actions.setLogChartData(logChartData.data);
        }
    }, [actions, logChartData?.data]);
    
    const {mutateAsync: bulkDeleteMutation, isPending: isBulkDeleting} = useMutation({
        ...bulkDeleteLogEntriesMutation(),
        onSuccess: (_, variables) => {
            if (variables.body.logIds) {
                actions.bulkRemoveLogEntries(variables.body.logIds);
                toast.success("Log entries deleted successfully.");
            }
        },
        onError: (error) => {
            console.error("Bulk delete failed:", error);
            toast.error("Failed to delete log entries. Please try again.");
        },
    })
    
    const bulkDeleteLogEntries = (logIds: string[]) => {
        if (logIds.length === 0) {
            toast.error("No log entries selected for deletion.");
            return;
        }

        return bulkDeleteMutation({
            body: {
                logIds: logIds
            }
        });
    };
    
    return {
        logEntries: data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        totalPages: data?.pages?.[0] ? data.pages[0]?.metadata?.pagination?.totalPages : 0,

        isLogOverviewLoading,
        logOverviewData: logOverview,

        isLogChartLoading,
        logChartData: logChartData,
        
        bulkDeleteLogEntries,
        isBulkDeleting
    };
}