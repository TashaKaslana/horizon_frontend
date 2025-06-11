'use client'

import {
    bulkDeleteUsersMutation,
    bulkUpdateUsersMutation,
    createUserMutation,
    deleteUserMutation,
    getAllUserIntroductionsInfiniteOptions,
    getDailyUserCountsOptions,
    getUserAnalyticsOverviewOptions,
    getUserOptions,
    updateUserAccount1Mutation,
    updateUserImageMutation,
    updateUserInfoMutation
} from "@/api/client/@tanstack/react-query.gen";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {getNextPageParam} from "@/lib/utils";
import useUsersStore from "@/app/admin/users/all/store/useUsersStore";
import {useEffect, useRef} from "react";
import {toast} from "sonner";
import {
    UserCreateDto,
    UserUpdateInfoDto,
    UserAccountUpdate,
    UserRespondDto,
    UserImageUpdate,
    BulkUserUpdateRequest
} from "@/api/client/types.gen";
import {
    zUserCreateDto,
    zUserUpdateInfoDto,
    zUserAccountUpdate,
    zUserImageUpdate
} from "@/api/client/zod.gen";

const useUsersManagement = (userId?: string, timeRange?: number) => {
    const {actions} = useUsersStore();
    // Add a ref to track if the component using this hook is mounted
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const {
        data: userListData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteQuery({
        ...getAllUserIntroductionsInfiniteOptions({
            query: {
                page: 0,
                size: 10,
                sort: ["createdAt", "desc"],
            },
        }),
        getNextPageParam: (lastPage) => getNextPageParam(lastPage),
        initialPageParam: 0
    });

    const {
        data: selectedUserData,
        isLoading: isSelectedUserLoading,
        isError: isSelectedUserError
    } = useQuery({
        ...getUserOptions({
            path: {
                id: userId || "",
            }
        }),
        enabled: !!userId,
    })

    useEffect(() => {
        if (isMounted.current && userListData) {
            actions.setInfiniteQueryData(userListData);
        }
    }, [actions, userListData]);

    const {data: userOverviewData, isLoading: isUserOverviewLoading} = useQuery({
        ...getUserAnalyticsOverviewOptions()
    })

    useEffect(() => {
        // Only update state if the component is mounted
        if (isMounted.current && userOverviewData?.data) {
            actions.setOverviewData(userOverviewData.data);
        }
    }, [actions, userOverviewData?.data]);

    const {data: userChartData, isLoading: isUserChartLoading} = useQuery({
        ...getDailyUserCountsOptions({
            query: {
                days: timeRange ?? 30,
            }
        })
    });

    useEffect(() => {
        if (isMounted.current && userChartData?.data) {
            actions.setChartData(userChartData.data);
        }
    }, [actions, userChartData?.data]);


    const {mutate: createUserFn, isPending: isCreatingUser} = useMutation({
        ...createUserMutation(),
        onSuccess: (res) => {
            if (res.data) {
                actions.addUser(res.data as UserRespondDto);
                toast.success("User created successfully.");
            }
        },
        onError: (err) => {
            console.error("Create user error:", err);
            toast.error("Failed to create user.");
        }
    });

    const createUser = (data: UserCreateDto) => {
        const validationResult = zUserCreateDto.safeParse(data);
        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            return;
        }
        createUserFn({body: validationResult.data});
    };

    const {mutate: updateUserInfoFn, isPending: isUpdatingUserInfo} = useMutation({
        ...updateUserInfoMutation(),
        onSuccess: (res) => {
            if (res.data) {
                actions.updateUser(res.data as UserRespondDto);
                toast.success("User info updated.");
            }
        },
        onError: (err) => {
            console.error("Update info error:", err);
            toast.error("Failed to update user info.");
        }
    });

    const updateUserInfo = (id: string, data: UserUpdateInfoDto) => {
        const validationResult = zUserUpdateInfoDto.safeParse(data);
        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            return;
        }
        updateUserInfoFn({
            path: {id}, body: {
                ...validationResult.data,
                dateOfBirth: validationResult.data.dateOfBirth ?
                    new Date(validationResult.data.dateOfBirth) : undefined,
            }
        });
    };

    const {mutate: updateUserAccountFn, isPending: isUpdatingUserAccount} = useMutation({
        ...updateUserAccount1Mutation(),
        onSuccess: (res) => {
            if (res.data) {
                actions.updateUser(res.data as UserRespondDto);
                toast.success("User account updated.");
            }
        },
        onError: (err) => {
            console.error("Update account error:", err);
            toast.error("Failed to update user account.");
        }
    });

    const updateUserAccount = (id: string, data: UserAccountUpdate) => {
        const validationResult = zUserAccountUpdate.safeParse(data);
        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            return;
        }
        updateUserAccountFn({path: {id}, body: validationResult.data});
    };

    const {mutate: updateUserImageMutateFn, isPending: isUpdatingUserImage} = useMutation({
        ...updateUserImageMutation(),
        onSuccess: (res) => {
            if (res.data) {
                actions.updateUser(res.data as UserRespondDto);
                toast.success("User image updated.");
            }
        },
        onError: (err) => {
            console.error("Update image error:", err);
            toast.error("Failed to update user image.");
        }
    });

    const updateUserImage = (data: UserImageUpdate) => {
        const validationResult = zUserImageUpdate.safeParse(data);
        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            return;
        }
        updateUserImageMutateFn({body: validationResult.data});
    };

    const {mutate: deleteUserFn, isPending: isDeletingUser} = useMutation({
        ...deleteUserMutation(),
        onSuccess: (_, variables) => {
            actions.removeUser(variables.path.id);
            toast.success("User deleted.");
        },
        onError: (err) => {
            console.error("Delete user error:", err);
            toast.error("Failed to delete user.");
        }
    });

    const deleteUser = (id: string) => {
        deleteUserFn({path: {id}});
    };

    const {mutateAsync: bulkUserDeleteMutation, isPending: isBulkUserDeleting} = useMutation({
        ...bulkDeleteUsersMutation(),
        onSuccess: (_, variables) => {
            if (variables) {
                variables.body.userIds.forEach(userId => {
                    actions.removeUser(userId);
                });
                toast.success("Users deleted successfully.");
            }
        },
        onError: (err) => {
            console.error("Bulk delete users error:", err);
            toast.error("Failed to delete users.");
        }
    })

    const deleteBulkUsers = (userIds: string[]) => {
        return bulkUserDeleteMutation({body: {userIds}});
    }

    const {mutateAsync: bulkUserUpdateMutation, isPending: isBulkUserUpdating} = useMutation({
        ...bulkUpdateUsersMutation(),
        onSuccess: (res) => {
            if (res.data) {
                res.data.forEach(user => {
                    actions.updateUser(user);
                });
                toast.success("Users updated successfully.");
            }
        },
        onError: (err) => {
            console.error("Bulk update users error:", err);
            toast.error("Failed to update users.");
        }
    })

    const bulkUpdateUsers = (request: BulkUserUpdateRequest) => {
        return bulkUserUpdateMutation({
            body: request
        });
    }

    return {
        userListData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,

        selectedUserData: selectedUserData,
        isSelectedUserLoading,
        isSelectedUserError,

        userOverviewData,
        isUserOverviewLoading,

        userChartData,
        isUserChartLoading,

        createUser,
        isCreatingUser,

        updateUserInfo,
        isUpdatingUserInfo,

        updateUserAccount,
        isUpdatingUserAccount,

        updateUserImage,
        isUpdatingUserImage,

        deleteUser,
        isDeletingUser,

        deleteBulkUsers,
        isBulkUserDeleting,

        bulkUpdateUsers,
        isBulkUserUpdating
    };
};

export default useUsersManagement;

