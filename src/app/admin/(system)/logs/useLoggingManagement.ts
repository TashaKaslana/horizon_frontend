import useLoggingStore from "@/app/admin/(system)/logs/useLoggingStore";
import {useInfiniteQuery} from "@tanstack/react-query";
import {getAllLogEntriesInfiniteOptions} from "@/api/client/@tanstack/react-query.gen";
import {getNextPageParam} from "@/lib/utils";
import {useEffect} from "react";

export const useLoggingManagement = (severities: ("INFO" | "WARNING" | "ERROR" | "CRITICAL")[]) => {
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

    return {
        logEntries: data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        totalPages: data?.pages?.[0] ? data.pages[0]?.metadata?.pagination?.totalPages : 0,
    };
}