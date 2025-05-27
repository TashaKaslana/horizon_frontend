'use client'

import {
    createTagMutation,
    deleteTagMutation,
    getAllTagsInfiniteOptions,
    updateTagMutation,
} from "@/api/client/@tanstack/react-query.gen";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { getNextPageParam } from "@/lib/utils";
import useTagStore from "../store/useTagStore";
import { useEffect } from "react";
import { toast } from "sonner";
import {
    CreateTagRequest,
    PaginationInfo,
    UpdateTagRequest,
    TagResponse,
} from "@/api/client/types.gen";
import { zCreateTagRequest } from "@/api/client/zod.gen"; // Assuming similar zod schema exists for tags

export const useTagManagement = () => {
    const { infiniteQueryData, actions } = useTagStore();

    const {
        data: tagsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        ...getAllTagsInfiniteOptions({ // Updated to getPostTagsInfiniteOptions
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

    const { mutate: createTagMutationFn, isPending: isCreatingTag } = useMutation({
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

    const { mutate: updateTagMutationFn, isPending: isUpdatingTag } = useMutation({
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
            path: { tagId : id },
        });
    };

    const { mutate: deleteTagMutationFn, isPending: isDeletingTag } = useMutation({
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

        deleteTagMutationFn({ path: { tagId: tagId } });
    };

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
    };
};

