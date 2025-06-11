'use client'

import {
    bulkDeleteTagsMutation,
    createTagMutation,
    deleteTagMutation,
    getDailyTagCountsOptions,
    getTagAnalyticsOverviewOptions, getTagDistributionOptions,
    getTagsWithCountsInfiniteOptions,
    updateTagMutation,
} from "@/api/client/@tanstack/react-query.gen";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {getNextPageParam} from "@/lib/utils";
import useTagStore from "../store/useTagStore";
import {useEffect} from "react";
import {toast} from "sonner";
import {
    CreateTagRequest,
    PaginationInfo,
    UpdateTagRequest,
    TagResponse,
} from "@/api/client/types.gen";
import {zCreateTagRequest} from "@/api/client/zod.gen";

export const useTagManagement = (timeRange: number = 30) => {
    const {infiniteQueryData, actions} = useTagStore();

    const {
        data: tagsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        ...getTagsWithCountsInfiniteOptions({ // Updated to getPostTagsInfiniteOptions
            query: {
                page: 0,
                size: 10,
            },
        }),
        getNextPageParam: (lastPage) => {
            return getNextPageParam(lastPage);
        },
        initialPageParam: 0,
    });

    useEffect(() => {
        if (tagsData) {
            actions.setInfiniteQueryData(tagsData);
        }
    }, [actions, tagsData]);

    const {data: overviewData, isLoading: isOverviewLoading} = useQuery({
        ...getTagAnalyticsOverviewOptions()
    })

    useEffect(() => {
        if (overviewData?.data) {
            actions.setOverviewData(overviewData.data);
        }
    }, [actions, overviewData?.data]);

    const {data: dailyCreatedCount, isLoading: isDailyCreatedCountLoading} = useQuery({
        ...getDailyTagCountsOptions()
    });

    useEffect(() => {
        if (dailyCreatedCount?.data) {
            actions.setDailyCreatedCount(dailyCreatedCount.data);
        }
    }, [actions, dailyCreatedCount?.data]);

    const {data: dailyUsageCount, isLoading: isDailyUsageCountLoading} = useQuery({
        ...getTagDistributionOptions({
            query: {
                days: timeRange
            }
        })
    });

    useEffect(() => {
        if (dailyUsageCount?.data) {
            actions.setDailyUsageCount(dailyUsageCount.data);
        }
    }, [actions, dailyUsageCount?.data]);

    const {mutate: createTagMutationFn, isPending: isCreatingTag} = useMutation({
        ...createTagMutation({}),
        onSuccess: (newTag) => {
            if (newTag.data) {
                actions.addTag(newTag.data as TagResponse); // Updated to addTag and PostTag
                toast.success("Tag created successfully.");
            }
        },
        onError: (error) => {
            console.error("Failed to create tag:", error);
            toast.error("Failed to create tag. Please try again.");
        },
    });

    const createTag = (data: CreateTagRequest) => {
        const validationResult = zCreateTagRequest.safeParse(data);

        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            return;
        }

        createTagMutationFn({
            body: validationResult.data,
        });
    };

    const {mutate: updateTagMutationFn, isPending: isUpdatingTag} = useMutation({
        ...updateTagMutation({}), // Updated to updatePostTagMutation
        onSuccess: (updatedTag) => {
            if (updatedTag.data) {
                actions.updateTag(updatedTag.data as TagResponse);
                toast.success("Tag updated successfully.");
            }
        },
        onError: (error) => {
            console.error("Failed to update tag:", error);
            toast.error("Failed to update tag. Please try again.");
        },
    });

    const updateTag = (id: string, data: UpdateTagRequest) => {
        if (!id) {
            toast.error("Tag ID is required for update.");
            return;
        }

        updateTagMutationFn({
            body: data,
            path: {tagId: id},
        });
    };

    const {mutate: deleteTagMutationFn, isPending: isDeletingTag} = useMutation({
        ...deleteTagMutation({}),
        onSuccess: (_, variables) => {
            if (!infiniteQueryData) {
                actions.removeTag(variables.path.tagId);
                toast.success("Tag deleted successfully.");
            }
        },
        onError: (error) => {
            console.error("Failed to delete tag:", error);
            toast.error("Failed to delete tag. Please try again.");
        },
    });

    const deleteTag = (tagId: string) => {
        if (!tagId) {
            toast.error("Tag ID is required for deletion.");
            return;
        }

        deleteTagMutationFn({path: {tagId: tagId}});
    };

    const {mutate: bulkDeleteTags, isPending: isBulkDeletingTags} = useMutation({
        ...bulkDeleteTagsMutation(),
        onSuccess: (_, variables) => {
            if (variables.body.tagIds) {
                actions.bulkRemoveTags(variables.body.tagIds);
                toast.success("Tags deleted successfully.");
            }
        },
        onError: (error) => {
            console.error("Failed to delete tags:", error);
            toast.error("Failed to delete tags. Please try again.");
        },
    });

    const bulkRemoveTags = async (tagIds: string[]) => {
        if (tagIds.length === 0) {
            toast.error("No tags selected for deletion.");
            return;
        }

        return bulkDeleteTags({
            body: {tagIds},
        });
    }

    return {
        tags: tagsData?.pages.flatMap((page) => page.data) || [],
        totalPages: tagsData?.pages.length || 0,
        paginationInfo: tagsData?.pages[0]?.metadata as PaginationInfo,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
        error,
        createTag,
        isCreatingTag,
        updateTag,
        isUpdatingTag,
        deleteTag,
        isDeletingTag,

        overviewData: overviewData?.data || [],
        isOverviewLoading,
        dailyCreatedCount: dailyCreatedCount?.data || [],
        isDailyCreatedCountLoading,
        dailyUsageCount: dailyUsageCount?.data || [],
        isDailyUsageCountLoading,

        bulkRemoveTags,
        isBulkDeletingTags,
    };
};

