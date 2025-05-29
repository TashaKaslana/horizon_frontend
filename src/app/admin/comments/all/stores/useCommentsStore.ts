'use client'

import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import { CommentResponseWithPostDetails } from "@/api/client/types.gen";

export interface CommentPage {
    data?: CommentResponseWithPostDetails[];
}

interface CommentsState {
    comments: CommentResponseWithPostDetails[];
    selectedComment: CommentResponseWithPostDetails | null;
    infiniteQueryData: InfiniteData<CommentPage> | null;
    actions: {
        setInfiniteQueryData: (data: InfiniteData<CommentPage> | null) => void;
        setSelectedComment: (comment: CommentResponseWithPostDetails | null) => void;
        clearAllData: () => void;
        addComment: (comment: CommentResponseWithPostDetails) => void;
        updateComment: (comment: CommentResponseWithPostDetails) => void;
        removeComment: (commentId: string) => void;
        setComments: (comments: CommentResponseWithPostDetails[]) => void;
    };
}

const useCommentsStore = create<CommentsState>()(
    immer((set) => ({
        comments: [],
        infiniteQueryData: null,
        selectedComment: null,
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
                    state.comments = state.comments.map((c) => (c.id === updatedComment.id ? updatedComment : c));
                    if (state.selectedComment?.id === updatedComment.id) {
                        state.selectedComment = { ...state.selectedComment, ...updatedComment };
                    }
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map((page) => ({
                            ...page,
                            data: (page.data ?? []).map((c) => (c.id === updatedComment.id ? updatedComment : c)),
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
                        const newPageParams: any[] = []; // pageParams type is unknown[]

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
        },
    }))
);

export default useCommentsStore;

