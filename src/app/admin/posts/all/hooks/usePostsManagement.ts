'use client'

import {
    bulkDeletePostsMutation, bulkUpdatePostsMutation,
    createPostMutation,
    deleteAllPostsByUserMutation,
    deletePostMutation,
    getAllPostsForAdminInfiniteOptions,
    getAllPostsForAdminInfiniteQueryKey,
    getAllPostWithDetailsForAdminInfiniteOptions,
    getDailyPostCountOptions,
    getPostAnalyticsOptions,
    getPostByIdForAdminOptions,
    updatePostMutation
} from "@/api/client/@tanstack/react-query.gen";
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    CreatePostRequest,
    UpdatePostRequest,
    RestApiResponseVoid, BulkPostUpdateRequest
} from "@/api/client/types.gen";
import {zCreatePostRequest, zUpdatePostRequest} from "@/api/client/zod.gen";
import usePostsStore from "../stores/usePostsStore";
import {useEffect, useRef} from "react";
import {getNextPageParam} from "@/lib/utils";

export const usePostsManagement = (postId?: string, dailyRange?: number) => {
    const {actions} = usePostsStore();
    const queryClient = useQueryClient();
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const {
        data: postListData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        ...getAllPostWithDetailsForAdminInfiniteOptions({
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
        data: selectedPostData,
        isLoading: isSelectedPostLoading,
        isError: isSelectedPostError
    } = useQuery({
        ...getPostByIdForAdminOptions({
            path: {
                postId: postId!,
            }
        }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        enabled: !!postId,
        throwOnError: true,
    });

    useEffect(() => {
        if (!isMounted.current || !postId && !postListData) return;

        actions.setInfiniteQueryData(postListData);
    }, [postId, actions, postListData]);

    const {data: postOverviewData, isLoading: isPostOverviewLoading} = useQuery({
        ...getPostAnalyticsOptions(),
    })

    useEffect(() => {
        if (isMounted.current && postOverviewData?.data) {
            actions.setOverviewData(postOverviewData.data)
        }
    }, [actions, postOverviewData?.data]);

    const {data: dailyPostCount, isLoading: isDailyPostCountLoading} = useQuery({
        ...getDailyPostCountOptions({
            query: {
                days: dailyRange ?? 30
            }
        }),
    })

    useEffect(() => {
        if (isMounted.current && dailyPostCount?.data) {
            actions.setChartData(dailyPostCount.data);
        }
    }, [actions, dailyPostCount?.data]);

    const {mutate: createPostMutateFn, isPending: isCreatingPost} = useMutation({
        ...createPostMutation(),
        onSuccess: (res) => {
            if (res.data?.id) {
                queryClient.invalidateQueries({queryKey: getAllPostsForAdminInfiniteOptions().queryKey}).then();
                toast.success("Post created successfully.");
            } else {
                toast.error("Failed to create post: No ID returned or creation failed.");
            }
        },
        onError: (err) => {
            console.error("Create post error:", err);
            toast.error("Failed to create post.");
        }
    });

    const createPost = async (data: CreatePostRequest) => {
        const validationResult = zCreatePostRequest.safeParse(data);
        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            return;
        }
        createPostMutateFn({body: validationResult.data});
    };

    const {
        mutate: updatePostMutateFn,
        mutateAsync: updatePostMutateAsyncFn,
        isPending: isUpdatingPost
    } = useMutation({
        ...updatePostMutation(),
        onSuccess: (res) => {
            actions.updatePost(res.data!);
        },
        onError: (err) => {
            console.error("Update post error in hook:", err);
        }
    });

    const updatePost = async (id: string, data: UpdatePostRequest): Promise<RestApiResponseVoid> => {
        const validationResult = zUpdatePostRequest.safeParse(data);
        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            throw validationResult.error;
        }
        return updatePostMutateAsyncFn({
            body: validationResult.data,
            path: {
                postId: id
            }
        });
    };

    const {mutate: deletePostFn, isPending: isDeletingPost} = useMutation({
        ...deletePostMutation(),
        onSuccess: (_, variables) => {
            actions.removePost(variables.path.postId);
            toast.success("Post deleted successfully.");
        },
        onError: (err) => {
            console.error("Delete post error:", err);
            toast.error("Failed to delete post.");
        }
    });

    const deletePost = async (postId: string) => {
        return deletePostFn({path: {postId}});
    };

    const {mutate: bulkDeletePostsMutateFn, isPending: isBulkDeletingPosts} = useMutation({
        ...bulkDeletePostsMutation(),
        onSuccess: (_, variables) => {
            if (variables) {
                variables.body.postIds.forEach(postId => {
                    actions.removePost(postId);
                });
                toast.success("Posts deleted successfully.");
            }
        },
        onError: (err) => {
            console.error("Bulk delete posts error:", err);
            toast.error("Failed to delete posts.");
        }
    });

    const bulkDeletePosts = async (postIds: string[]) => {
        return bulkDeletePostsMutateFn({body: {postIds}});
    };

    const {mutate: deleteAllPostsByUserMutateFn, isPending: isDeletingAllUserPosts} = useMutation({
        ...deleteAllPostsByUserMutation(),
        onSuccess: (_, variables) => {
            if (variables) {
                queryClient.invalidateQueries({
                    queryKey: getAllPostsForAdminInfiniteQueryKey({
                        query: {
                            page: 0,
                            size: 10,
                            sort: ["createdAt", "desc"],
                        }
                    })
                }).then();
                toast.success("All posts by user deleted successfully.");
            }
        },
        onError: (err) => {
            console.error("Delete all posts by user error:", err);
            toast.error("Failed to delete all posts by user.");
        }
    });

    const deleteAllPostsByUser = async (userId: string) => {
        return deleteAllPostsByUserMutateFn({
            path: {userId}
        });
    };

    const {mutate: bulkUpdatePostsMutateFn, isPending: isBulkUpdatingPosts} = useMutation({
        ...bulkUpdatePostsMutation(),
        onSuccess: (res) => {
            if (res.data) {
                res.data.forEach(post => {
                    actions.updatePost(post);
                });
                toast.success("Posts updated successfully.");
            } else {
                toast.error("Failed to update posts: No data returned or update failed.");
            }
        },
        onError: (err) => {
            console.error("Bulk update posts error:", err);
            toast.error("Failed to update posts.");
        }
    })

    const bulkUpdatePosts = async (data: BulkPostUpdateRequest) => {
        return bulkUpdatePostsMutateFn({
            body: data
        });
    };

    return {
        postListData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,

        selectedPostData,
        isSelectedPostLoading,
        isSelectedPostError,

        postOverviewData,
        isPostOverviewLoading,

        dailyPostCount,
        isDailyPostCountLoading,

        createPost,
        isCreatingPost,

        updatePost,
        isUpdatingPost,

        deletePost,
        isDeletingPost,

        bulkDeletePosts,
        isBulkDeletingPosts,

        deleteAllPostsByUser,
        isDeletingAllUserPosts,

        bulkUpdatePosts,
        isBulkUpdatingPosts,
    };
}

