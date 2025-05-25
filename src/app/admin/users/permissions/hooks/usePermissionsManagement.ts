'use client'

import { getAllPermissionsInfiniteOptions } from "@/api/client/@tanstack/react-query.gen"; // Adjust if your generator creates a different name or path
import { useInfiniteQuery } from "@tanstack/react-query";
import { getNextPageParam } from "@/lib/utils";
import usePermissionsStore from "@/app/admin/users/permissions/stores/usePermissionsStore";
import { useEffect } from "react";

const usePermissionsManagement = () => {
    const { actions } = usePermissionsStore();

    const { data: permissionListData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
        ...getAllPermissionsInfiniteOptions({
            query: {
                page: 0,
                size: 10,
                sort: ["name", "asc"],
            },
        }),
        getNextPageParam: (lastPage) => {
            return getNextPageParam(lastPage);
        },
        initialPageParam: 0
    });

    useEffect(() => {
        if (permissionListData) {
            actions.setInfiniteQueryData(permissionListData);
        }
    }, [actions, permissionListData]);

    return {
        permissions: usePermissionsStore((state) => state.permissions),
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    };
}

export default usePermissionsManagement;

