'use client'

import {
    createPostMutation,
    deletePostMutation, getAllPostsForAdminInfiniteOptions, getPostByIdOptions,
    updatePostMutation
} from "@/api/client/@tanstack/react-query.gen";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "sonner";
import {CreatePostRequest, UpdatePostRequest} from "@/api/client/types.gen";
import {zCreatePostRequest, zUpdatePostRequest} from "@/api/client/zod.gen";
import usePostsStore from "../stores/usePostsStore";
import {useEffect} from "react";
import {getNextPageParam} from "@/lib/utils";

export const usePostsManagement = (postId?: string) => {
    const {actions} = usePostsStore();

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
        data: selectedPostDataResponse,
        isLoading: isSelectedPostLoading,
        isError: isSelectedPostError
    } = useQuery({
        ...getPostByIdOptions({
            path: {
                postId: postId || "",
            }
        }),
        enabled: !!postId,
    });

    useEffect(() => {
        actions.setInfiniteQueryData(postListData );
    }, [actions, postListData]);

    const {mutate: createPostMutateFn, isPending: isCreatingPost} = useMutation({
        ...createPostMutation(),
        onSuccess: (res) => {
            if (res.data) {
                actions.addPost(res.data);
                toast.success("Post created successfully.");
            }
        },
        onError: (err) => {
            console.error("Create post error:", err);
            toast.error("Failed to create post.");
        }
    });

    const createPost = (data: CreatePostRequest) => {
        const validationResult = zCreatePostRequest.safeParse(data);
        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            return;
        }
        createPostMutateFn({body: validationResult.data});
    };

    const {mutate: updatePostMutateFn, isPending: isUpdatingPost} = useMutation({
        ...updatePostMutation(),
        onSuccess: (res) => {
            if (res.data) {
                actions.updatePost(res.data);
                toast.success("Post updated successfully.");
            }
        },
        onError: (err) => {
            console.error("Update post error:", err);
            toast.error("Failed to update post.");
        }
    });

    const updatePost = (id: string, data: UpdatePostRequest) => {
        const validationResult = zUpdatePostRequest.safeParse(data);
        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            return;
        }
        updatePostMutateFn({
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
            toast.success("Post deleted.");
        },
        onError: (err) => {
            console.error("Delete post error:", err);
            toast.error("Failed to delete post.");
        }
    });

    const deletePost = (id: string) => {
        deletePostFn({path: {postId: id}});
    };

    return {
        postListData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,

        selectedPostData: selectedPostDataResponse,
        isSelectedPostLoading,
        isSelectedPostError,

        createPost,
        isCreatingPost,

        updatePost,
        isUpdatingPost,

        deletePost,
        isDeletingPost,
    };
}
