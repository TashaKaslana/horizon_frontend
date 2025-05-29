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
                    state.comments = newComments;
                    if (state.infiniteQueryData) {
                        const remainingComments = [...newComments];
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageCommentsCount = page.data?.length || 0;
                            const commentsForThisPage = remainingComments.splice(0, pageCommentsCount);
                            return {
                                ...page,
                                data: commentsForThisPage
                            };
                        }).filter(page => page.data && page.data.length > 0);

                        if (newComments.length > 0 && state.infiniteQueryData.pages.length === 0) {
                            state.infiniteQueryData.pages = [{ data: newComments }];
                            state.infiniteQueryData.pageParams = [0]; // Assuming pageParam starts at 0
                        }
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

