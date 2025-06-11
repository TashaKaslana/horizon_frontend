'use client'

import {
    createRoleMutation,
    deleteRoleMutation,
    getAllRolesInfiniteOptions,
    updateRoleMutation,
    bulkDeleteRolesMutation
} from "@/api/client/@tanstack/react-query.gen";
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import {getNextPageParam} from "@/lib/utils";
import useRolesStore from "../store/useRolesStore";
import {useEffect} from "react";
import {toast} from "sonner";
import {CreateRoleRequest, RoleDto, PaginationInfo, UpdateRoleRequest} from "@/api/client/types.gen";
import {zCreateRoleRequest} from "@/api/client/zod.gen";

export const useRolesManagement = () => {
    const {infiniteQueryData, actions} = useRolesStore();

    const {
        data: roleListData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteQuery({
        ...getAllRolesInfiniteOptions({
            query: {
                page: 0,
                size: 10,
            }
        }),
        getNextPageParam: (lastPage) => {
            return getNextPageParam(lastPage);
        },
        initialPageParam: 0
    });

    useEffect(() => {
        if (roleListData) {
            actions.setInfiniteQueryData(roleListData);
        }
    }, [actions, roleListData]);

    const {mutate: createRoleMutationFn, isPending: isCreatingRole} = useMutation({
        ...createRoleMutation({}),
        onSuccess: (newRole) => {
            if (newRole.data) {
                actions.addRole(newRole.data);
                toast.success("Role created successfully.");
            }
        },
        onError: (error) => {
            console.error("Failed to create role:", error);
            toast.error("Failed to create role. Please try again.");
        },
    });

    const createRole = (data: CreateRoleRequest) => {
        const validationResult = zCreateRoleRequest.safeParse(data);

        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            return;
        }

        createRoleMutationFn({
            body: validationResult.data
        });
    };

    const {mutate: updateRoleMutationFn, isPending: isUpdatingRole} = useMutation({
        ...updateRoleMutation({}),
        onSuccess: (updatedRole) => {
            if (updatedRole.data) {
                actions.updateRole(updatedRole.data as RoleDto);
                toast.success("Role updated successfully.");
            }
        },
        onError: (error) => {
            console.error("Failed to update role:", error);
            toast.error("Failed to update role. Please try again.");
        },
    });

    const updateRole = (id: string, data: UpdateRoleRequest) => {
        if (!id) {
            toast.error("Role ID is required for update.");
            return;
        }

        updateRoleMutationFn({
            body: data,
            path: {id},
        });
    };

    const {mutate: deleteRoleMutationFn, isPending: isDeletingRole} = useMutation({
        ...deleteRoleMutation({}),
        onSuccess: (_, variables) => {
            if (!infiniteQueryData) {
                actions.removeRole(variables.path.id);
                toast.success("Role deleted successfully.");
            }
        },
        onError: (error) => {
            console.error("Failed to delete role:", error);
            toast.error("Failed to delete role. Please try again.");
        },
    });

    const deleteRole = (roleId: string) => {
        if (!roleId) {
            toast.error("Role ID is required for deletion.");
            return;
        }

        deleteRoleMutationFn({path: {id: roleId}});
    };

    const {mutate: bulkDeleteRoles, isPending: isBulkDeletingRoles} = useMutation({
        ...bulkDeleteRolesMutation(),
        onSuccess: (_, variables) => {
            if (variables.body.roleIds) {
                actions.removeBulkRole(variables.body.roleIds);
                toast.success("Roles deleted successfully.");
            }
        },
        onError: (error) => {
            console.error("Failed to delete roles:", error);
            toast.error("Failed to delete roles. Please try again.");
        },
    });

    const bulkDeleteRolesHandler = async (roleIds: string[]) => {
        if (roleIds.length === 0) {
            toast.error("No roles selected for deletion.");
            return;
        }

        return bulkDeleteRoles({body: {roleIds}});
    }

    return {
        roles: roleListData?.pages.flatMap(page => page.data) || [],
        totalPages: roleListData?.pages.length || 0,
        paginationInfo: roleListData?.pages[0]?.metadata as PaginationInfo,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
        error,
        createRole,
        isCreatingRole,
        updateRole,
        isUpdatingRole,
        deleteRole,
        isDeletingRole,

        bulkDeleteRolesHandler,
        isBulkDeletingRoles
    };
}

