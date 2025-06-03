'use client'

import {
    createPostMutation,
    deletePostMutation,
    getAllPostsForAdminInfiniteOptions,
    getDailyPostCountOptions,
    getPostAnalyticsOptions,
    getPostByIdForAdminOptions,
    updatePostMutation
} from "@/api/client/@tanstack/react-query.gen";
import {InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    CreatePostRequest,
    PostAdminViewDto,
    UpdatePostRequest,
    PostResponse,
    PostCategorySummary,
    RestApiResponseVoid
} from "@/api/client/types.gen";
import {zCreatePostRequest, zUpdatePostRequest} from "@/api/client/zod.gen";
import usePostsStore, {PostPage} from "../stores/usePostsStore";
import {useEffect} from "react";
import {getNextPageParam} from "@/lib/utils";

export const usePostsManagement = (postId?: string, dailyRange?: number) => {
    const {actions} = usePostsStore();
    const queryClient = useQueryClient();

    const {
        data: postListData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        ...getAllPostsForAdminInfiniteOptions({
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
        if (!postId && !postListData) return;

        const postResponseToAdminViewDto = (post: PostResponse): PostAdminViewDto => {
            const { categoryName, visibility, createdAt, updatedAt, ...rest } = post;
            return {
                ...rest,
                id: post.id,
                visibility: visibility as PostAdminViewDto['visibility'],
                category: categoryName ? ({ name: categoryName } as PostCategorySummary) : undefined,
                createdAt: new Date(createdAt ?? '') ,
                updatedAt: new Date(updatedAt ?? ''),
            };
        };

        const transformedData: InfiniteData<PostPage> = {
            ...postListData,
            pages: postListData?.pages?.map(page => ({
                ...page,
                data: page.data?.map(postResponseToAdminViewDto) ?? [],
            })),
        };
        actions.setInfiniteQueryData(transformedData);
    }, [postId, actions, postListData]);

    const {data: postOverviewData, isLoading: isPostOverviewLoading} = useQuery({
        ...getPostAnalyticsOptions(),
    })

    useEffect(() => {
        if (postOverviewData?.data) {
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
        if (dailyPostCount?.data) {
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

    const {
        mutateAsync: deletePostAsyncFn,
        isPending: isDeletingPost
    } = useMutation({
        ...deletePostMutation(),
        onSuccess: (_, variables) => {
            actions.removePost(variables.path.postId);
        },
        onError: (err) => {
            console.error("Delete post error in hook:", err);
            // Toast will be handled by the component using toast.promise
        }
    });

    const deletePost = (id: string): Promise<RestApiResponseVoid> => {
        return deletePostAsyncFn({path: {postId: id}});
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
    };
}

