'use client'

import {
    createPermissionMutation,
    deletePermissionMutation,
    getAllPermissionsInfiniteOptions,
    updatePermissionMutation,
} from "@/api/client/@tanstack/react-query.gen";
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import { getNextPageParam } from "@/lib/utils";
import usePermissionsStore from "@/app/admin/users/permissions/stores/usePermissionsStore";
import { useEffect } from "react";
import { toast } from "sonner";
import {CreatePermissionRequest, PermissionDto} from "@/api/client/types.gen";
import {zCreatePermissionRequest} from "@/api/client/zod.gen";

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

    const {mutate: createPermissionMutationFn, isPending: isCreatingPermission} = useMutation({
        ...createPermissionMutation({}),
        onSuccess: (newPermission) => {
            if (newPermission.data) {
                actions.addPermission(newPermission.data);
                toast.success("Permission created successfully.");
            }
        },
        onError: (error) => {
            console.error("Failed to create permission:", error);
            toast.error("Failed to create permission. Please try again.");
        },
    });

    const createPermission = (data: CreatePermissionRequest) => {
        const validationResult = zCreatePermissionRequest.safeParse(data);

        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            return;
        }

        createPermissionMutationFn({ body: validationResult.data });
    };

    const {mutate: updatePermissionMutationFn, isPending: isUpdatingPermission} = useMutation({
        ...updatePermissionMutation({}),
        onSuccess: (updatedPermission) => {
            if (updatedPermission.data) {
                actions.updatePermission(updatedPermission.data as PermissionDto);
                toast.success("Permission updated successfully.");
            }
        },
        onError: (error) => {
            console.error("Failed to update permission:", error);
            toast.error("Failed to update permission. Please try again.");
        },
    });

    const updatePermission = (data: PermissionDto) => {
        if (!data.id) {
            console.error("Update failed: Permission ID is missing.");
            toast.error("Update failed: Permission ID is missing.");
            return;
        }
        const { id, ...body } = data;
        updatePermissionMutationFn({
            path: { id: id },
            body: body
        });
    };

    const {mutate: deletePermissionMutationFn, isPending: isDeletingPermission} = useMutation({
        ...deletePermissionMutation({}),
        onSuccess: (_response, variables) => {
            let permissionIdToDelete: string | number | undefined;
            if (typeof variables === 'object' && variables !== null && variables.path && typeof variables.path.id !== 'undefined') {
                permissionIdToDelete = variables.path.id;
            }

            if (permissionIdToDelete !== undefined) {
                actions.removePermission(permissionIdToDelete);
                toast.success("Permission deleted successfully.");
            } else {
                toast.warning("Permission deleted, but local list might not be updated. Review delete handler.");
            }
        },
        onError: (error) => {
            console.error("Failed to delete permission:", error);
            toast.error("Failed to delete permission. Please try again.");
        },
    });

    const removePermission = (id: string) => {
        deletePermissionMutationFn({
            path: {
                id: id
            }
        });
    };

    return {
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        totalPages: permissionListData?.pages[0].metadata?.pagination?.totalPages || 0,
        error,
        createPermission,
        isCreatingPermission,
        updatePermission,
        isUpdatingPermission,
        removePermission,
        isDeletingPermission,
    };
}

export default usePermissionsManagement;

