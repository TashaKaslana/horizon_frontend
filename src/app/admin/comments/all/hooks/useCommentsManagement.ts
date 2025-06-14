'use client'

import {
    bulkUpdateCommentsMutation,
    createCommentMutation,
    deleteCommentMutation, deleteMultipleCommentsMutation,
    getAllCommentsWithPostDetailsInfiniteOptions, getCommentAnalyticsOverviewOptions,
    getCommentByIdOptions, getDailyCommentCountsOptions,
    updateCommentMutation
} from "@/api/client/@tanstack/react-query.gen";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {getNextPageParam} from "@/lib/utils";
import useCommentsStore from "../stores/useCommentsStore";
import {useEffect} from "react";
import {toast} from "sonner";
import {
    BulkCommentUpdateRequest,
    CreateCommentDto,
    UpdateCommentContentDto
} from "@/api/client/types.gen";
import {
    zCreateCommentDto,
    zUpdateCommentContentDto,
} from "@/api/client/zod.gen";

const useCommentsManagement = (commentId?: string, timeRange?: number) => {
    const {actions} = useCommentsStore();

    const {
        data: commentListData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteQuery({
        ...getAllCommentsWithPostDetailsInfiniteOptions({
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
        data: selectedCommentData,
        isLoading: isSelectedCommentLoading,
        isError: isSelectedCommentError
    } = useQuery({
        ...getCommentByIdOptions({
            path: {
                commentId: commentId || "",
            }
        }),
        enabled: !!commentId,
    });

    useEffect(() => {
        actions.setInfiniteQueryData(commentListData);
    }, [actions, commentListData]);

    const {data: commentOverviews, isLoading: isCommentOverviewLoading} = useQuery({
        ...getCommentAnalyticsOverviewOptions()
    })

    useEffect(() => {
        if (commentOverviews?.data) {
            actions.setOverviewStatistic(commentOverviews?.data);
        }
    }, [actions, commentOverviews?.data]);


    const {data: dailyComment, isLoading: isDailyCommentLoading} = useQuery({
        ...getDailyCommentCountsOptions({
            query: {
                days: timeRange ?? 30,
            }
        })
    })

    useEffect(() => {
        if (dailyComment?.data) {
            actions.setChartData(dailyComment?.data);
        }
    }, [actions, dailyComment?.data]);

    const {mutate: createCommentFn, isPending: isCreatingComment} = useMutation({
        ...createCommentMutation(),
        onSuccess: (res) => {
            if (res.data) {
                actions.addComment(res.data);
                toast.success("Comment created successfully.");
            }
        },
        onError: (err) => {
            console.error("Create comment error:", err);
            toast.error("Failed to create comment.");
        }
    });

    const createComment = (data: CreateCommentDto) => {
        const validationResult = zCreateCommentDto.safeParse(data);
        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            return;
        }
        createCommentFn({body: validationResult.data});
    };

    const {mutate: updateCommentFn, isPending: isUpdatingComment} = useMutation({
        ...updateCommentMutation(),
        onSuccess: (res) => {
            if (res.data) {
                actions.updateComment(res.data);
                toast.success("Comment updated successfully.");
            }
        },
        onError: (err) => {
            console.error("Update comment error:", err);
            toast.error("Failed to update comment.");
        }
    });

    const updateComment = (id: string, data: UpdateCommentContentDto) => {
        const validationResult = zUpdateCommentContentDto.safeParse(data);
        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            return;
        }
        updateCommentFn({path: {commentId: id}, body: validationResult.data});
    };

    const {mutate: deleteCommentFn, isPending: isDeletingComment} = useMutation({
        ...deleteCommentMutation(),
        onSuccess: (_, variables) => {
            actions.removeComment(variables.path.commentId);
            toast.success("Comment deleted.");
        },
        onError: (err) => {
            console.error("Delete comment error:", err);
            toast.error("Failed to delete comment.");
        }
    });

    const deleteComment = (id: string) => {
        deleteCommentFn({path: {commentId: id}});
    };

    const {mutateAsync: bulkUpdateCommentsFn, isPending: isUpdatingBulkComments} = useMutation({
        ...bulkUpdateCommentsMutation(),
        onSuccess: (res) => {
            res.data?.forEach((comment) => {
                actions.updateComment(comment);
            })

            toast.success("Comments updated successfully.");
        },
        onError: (err) => {
            console.error("Bulk update comments error:", err);
            toast.error("Failed to update comments.");
        }
    })

    const bulkUpdateComments = (request: BulkCommentUpdateRequest) => {
        return bulkUpdateCommentsFn({body: request});
    }

    const {mutateAsync: deleteMultipleCommentsFn, isPending: isDeletingMultipleComments} = useMutation({
        ...deleteMultipleCommentsMutation(),
        onSuccess: (_, variables) => {
            variables.query?.commentIds.forEach((commentId: string) => {
                actions.removeComment(commentId);
            });
            toast.success("Comments deleted successfully.");
        },
        onError: (err) => {
            console.error("Bulk delete comments error:", err);
            toast.error("Failed to delete comments.");
        }
    });

    const deleteMultipleComments = (commentIds: string[]) => {
        return deleteMultipleCommentsFn({query: {commentIds}});
    };

    return {
        commentListData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,

        selectedCommentData,
        isSelectedCommentLoading,
        isSelectedCommentError,

        commentOverviews,
        isCommentOverviewLoading,

        dailyComment,
        isDailyCommentLoading,

        createComment,
        isCreatingComment,

        updateComment,
        isUpdatingComment,

        deleteComment,
        isDeletingComment,

        bulkUpdateComments,
        isUpdatingBulkComments,

        deleteMultipleComments,
        isDeletingMultipleComments
    };
};

export default useCommentsManagement;

