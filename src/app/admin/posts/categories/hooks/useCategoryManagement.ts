'use client'

import {
    createPostCategoryMutation,
    deletePostCategoryMutation,
    getPostCategoriesInfiniteOptions,
    updatePostCategoryMutation,
} from "@/api/client/@tanstack/react-query.gen";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { getNextPageParam } from "@/lib/utils";
import useCategoryStore from "../store/useCategoryStore";
import { useEffect } from "react";
import { toast } from "sonner";
import {
    CreatePostCategoryRequest,
    PaginationInfo,
    UpdatePostCategoryRequest,
    PostCategory,
} from "@/api/client/types.gen";
import { zCreatePostCategoryRequest } from "@/api/client/zod.gen";

export const useCategoryManagement = () => {
    const { infiniteQueryData, actions } = useCategoryStore();

    const {
        data: categoriesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        ...getPostCategoriesInfiniteOptions({
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
        if (categoriesData) {
            actions.setInfiniteQueryData(categoriesData);
        }
    }, [actions, categoriesData]);

    const { mutate: createCategoryMutationFn, isPending: isCreatingCategory } = useMutation({
        ...createPostCategoryMutation({}),
        onSuccess: (newCategory) => {
            if (newCategory.data) {
                actions.addCategory(newCategory.data);
                toast.success("Category created successfully.");
            }
        },
        onError: (error) => {
            console.error("Failed to create category:", error);
            toast.error("Failed to create category. Please try again.");
        },
    });

    const createCategory = (data: CreatePostCategoryRequest) => {
        const validationResult = zCreatePostCategoryRequest.safeParse(data);

        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            toast.error(firstError.message);
            return;
        }

        createCategoryMutationFn({
            body: validationResult.data,
        });
    };

    const { mutate: updateCategoryMutationFn, isPending: isUpdatingCategory } = useMutation({
        ...updatePostCategoryMutation({}),
        onSuccess: (updatedCategory) => {
            if (updatedCategory.data) {
                actions.updateCategory(updatedCategory.data as PostCategory);
                toast.success("Category updated successfully.");
            }
        },
        onError: (error) => {
            console.error("Failed to update category:", error);
            toast.error("Failed to update category. Please try again.");
        },
    });

    const updateCategory = (id: string, data: UpdatePostCategoryRequest) => {
        if (!id) {
            toast.error("Category ID is required for update.");
            return;
        }

        updateCategoryMutationFn({
            body: data,
            path: { postCategoryId: id },
        });
    };

    const { mutate: deleteCategoryMutationFn, isPending: isDeletingCategory } = useMutation({
        ...deletePostCategoryMutation({}),
        onSuccess: (_, variables) => {
            if (!infiniteQueryData) {
                actions.removeCategory(variables.path.postCategoryId);
                toast.success("Category deleted successfully.");
            }
        },
        onError: (error) => {
            console.error("Failed to delete category:", error);
            toast.error("Failed to delete category. Please try again.");
        },
    });

    const deleteCategory = (categoryId: string) => {
        if (!categoryId) {
            toast.error("Category ID is required for deletion.");
            return;
        }

        deleteCategoryMutationFn({ path: { postCategoryId: categoryId } });
    };

    return {
        categories: categoriesData?.pages.flatMap((page) => page.data) || [],
        totalPages: categoriesData?.pages.length || 0,
        paginationInfo: categoriesData?.pages[0]?.metadata as PaginationInfo,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
        error,
        createCategory,
        isCreatingCategory,
        updateCategory,
        isUpdatingCategory,
        deleteCategory,
        isDeletingCategory,
    };
};
