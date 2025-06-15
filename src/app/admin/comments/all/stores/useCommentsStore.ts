'use client'

import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import {CommentResponseWithPostDetails, DailyCountDto, OverviewStatistic} from "@/api/client/types.gen";

export interface CommentPage {
    data?: CommentResponseWithPostDetails[];
}

interface CommentsState {
    comments: CommentResponseWithPostDetails[];
    selectedComment: CommentResponseWithPostDetails | null;
    infiniteQueryData: InfiniteData<CommentPage> | null;
    overviewData: OverviewStatistic[],
    chartData?: DailyCountDto[]
    actions: {
        setInfiniteQueryData: (data: InfiniteData<CommentPage> | null) => void;
        setSelectedComment: (comment: CommentResponseWithPostDetails | null) => void;
        setOverviewStatistic: (overviewStatistics: OverviewStatistic[]) => void;
        setChartData: (chartData: DailyCountDto[]) => void;
        clearAllData: () => void;
        addComment: (comment: CommentResponseWithPostDetails) => void;
        updateComment: (comment: Partial<CommentResponseWithPostDetails> & { id: string }) => void;
        removeComment: (commentId: string) => void;
        setComments: (comments: CommentResponseWithPostDetails[]) => void;
        // New bulk operations
        bulkUpdateComments: (commentIds: string[], data: Partial<CommentResponseWithPostDetails>) => void;
        bulkDeleteComments: (commentIds: string[]) => void;
    };
}

const useCommentsStore = create<CommentsState>()(
    immer((set) => ({
        comments: [],
        infiniteQueryData: null,
        selectedComment: null,
        overviewData: [],
        chartData: [],
        actions: {
            setInfiniteQueryData: (data) =>
                set((state) => {
                    state.infiniteQueryData = data;
                    state.comments = data?.pages?.flatMap((page: CommentPage) => page.data ?? []) ?? [];
                }),

            setSelectedComment: (comment) =>
                set((state) => {
                    state.selectedComment = comment;
                }),

            setOverviewStatistic: (overviewStatistics) =>
                set((state) => {
                    state.overviewData = overviewStatistics;
                }),

            setChartData: (chartData) =>
                set((state) => {
                    state.chartData = chartData;
                }),

            addComment: (newComment) =>
                set((state) => {
                    state.comments.unshift(newComment);
                    if (state.infiniteQueryData) {
                        const firstPage = state.infiniteQueryData.pages[0];
                        if (firstPage) {
                            firstPage.data = [newComment, ...(firstPage.data ?? [])];
                        }
                    }
                }),

            updateComment: (updatedComment) =>
                set((state) => {
                    state.comments = state.comments.map((c) => {
                        if (c.id === updatedComment.id) {
                            return { ...c, ...updatedComment };
                        }
                        return c;
                    });

                    if (state.selectedComment?.id === updatedComment.id) {
                        state.selectedComment = { ...state.selectedComment, ...updatedComment };
                    }

                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map((page) => ({
                            ...page,
                            data: (page.data ?? []).map((c) => {
                                if (c.id === updatedComment.id) {
                                    return { ...c, ...updatedComment };
                                }
                                return c;
                            }),
                        }));
                    }
                }),

            removeComment: (commentId) =>
                set((state) => {
                    state.comments = state.comments.filter((c) => c.id !== commentId);
                    if (state.selectedComment?.id === commentId) {
                        state.selectedComment = null;
                    }
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages
                            .map((page) => ({
                                ...page,
                                data: (page.data ?? []).filter((c) => c.id !== commentId),
                            }))
                            .filter((page) => (page.data?.length ?? 0) > 0);
                    }
                }),

            setComments: (newComments) =>
                set((state) => {
                    state.comments = newComments; // Update the flat list

                    if (state.infiniteQueryData) {
                        const pageSize = 10; // Consistent with the fetch size in useCommentsManagement.ts
                        const newPages: CommentPage[] = [];
                        const newPageParams = []; // pageParams type is unknown[]

                        if (newComments.length > 0) {
                            // Determine the starting page param, assuming numeric and sequential
                            // Uses the first pageParam from existing data as a base, or defaults to 0
                            let basePageParam = 0;
                            if (state.infiniteQueryData.pageParams && state.infiniteQueryData.pageParams.length > 0) {
                                const firstParam = state.infiniteQueryData.pageParams[0];
                                if (typeof firstParam === 'number') {
                                    basePageParam = firstParam;
                                }
                            }

                            for (let i = 0; i < newComments.length; i += pageSize) {
                                newPages.push({ data: newComments.slice(i, i + pageSize) });
                                newPageParams.push(basePageParam + (newPages.length - 1));
                            }
                        }
                        // If newComments.length is 0, newPages and newPageParams will be empty, effectively clearing them.

                        state.infiniteQueryData.pages = newPages;
                        state.infiniteQueryData.pageParams = newPageParams;
                    }
                }),

            clearAllData: () =>
                set((state) => {
                    state.comments = [];
                    state.infiniteQueryData = null;
                    state.selectedComment = null;
                }),

            bulkUpdateComments: (commentIds, data) =>
                set((state) => {
                    // Create a set for faster lookups
                    const updateSet = new Set(commentIds);

                    // Update in the flat comments array
                    state.comments = state.comments.map(comment => {
                        if (updateSet.has(comment.id)) {
                            return { ...comment, ...data };
                        }
                        return comment;
                    });

                    // Update the selected comment if it's in the update set
                    if (state.selectedComment && updateSet.has(state.selectedComment.id)) {
                        state.selectedComment = { ...state.selectedComment, ...data };
                    }

                    // Update in infiniteQueryData if it exists
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => ({
                            ...page,
                            data: (page.data ?? []).map(comment => {
                                if (updateSet.has(comment.id)) {
                                    return { ...comment, ...data };
                                }
                                return comment;
                            })
                        }));
                    }
                }),

            bulkDeleteComments: (commentIds) =>
                set((state) => {
                    // Create a set for faster lookups
                    const deleteSet = new Set(commentIds);

                    // Remove from flat comments array
                    state.comments = state.comments.filter(comment => !deleteSet.has(comment.id));

                    // Clear selected comment if it's in the delete set
                    if (state.selectedComment && deleteSet.has(state.selectedComment.id)) {
                        state.selectedComment = null;
                    }

                    // Remove from infiniteQueryData if it exists
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages
                            .map(page => ({
                                ...page,
                                data: (page.data ?? []).filter(comment => !deleteSet.has(comment.id))
                            }))
                            .filter(page => (page.data?.length ?? 0) > 0); // Remove empty pages
                    }
                }),
        },
    }))
);

export default useCommentsStore;
