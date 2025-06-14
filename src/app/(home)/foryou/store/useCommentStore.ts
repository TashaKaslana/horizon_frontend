import { create } from 'zustand';
import { CommentResponse } from '@/types/Comment';

interface CommentMap {
    [postId: string]: CommentResponse[];
}

interface CommentStore {
    commentsByPostId: CommentMap;
    lastUpdatedByPostId: Record<string, number>;

    setComments: (
        postId: string,
        comments: CommentResponse[] | ((prev: CommentResponse[]) => CommentResponse[]),
        timestamp?: string | number
    ) => void;

    addComment: (postId: string, comment: CommentResponse) => void;
    updateComment: (postId: string, id: string, partial: Partial<CommentResponse>) => void;
    removeComment: (postId: string, commentId: string) => void;
    clearComments: (postId: string) => void;
    getComments: (postId: string) => CommentResponse[];
}

export const useCommentStore = create<CommentStore>((set, get) => ({
    commentsByPostId: {},
    lastUpdatedByPostId: {},

    setComments: (postId, updater, ts = Date.now()) => {
        set((state) => {
            const incomingTs = typeof ts === "string" ? new Date(ts).getTime() : ts;
            const currentTs = state.lastUpdatedByPostId[postId] || 0;

            if (incomingTs < currentTs) {
                console.warn(`[CommentStore] Ignoring stale setComments for ${postId}`);
                return {};
            }

            const prev = state.commentsByPostId[postId] || [];
            const newComments =
                typeof updater === "function" ? updater(prev) : updater;

            return {
                commentsByPostId: {
                    ...state.commentsByPostId,
                    [postId]: newComments,
                },
                lastUpdatedByPostId: {
                    ...state.lastUpdatedByPostId,
                    [postId]: incomingTs,
                },
            };
        });
    },

    addComment: (postId, comment) =>
        set((state) => {
            const existing = state.commentsByPostId[postId] || [];
            const isDuplicate = existing.some((c) => c.id === comment.id);

            return isDuplicate
                ? {}
                : {
                    commentsByPostId: {
                        ...state.commentsByPostId,
                        [postId]: [comment, ...existing],
                    },
                    lastUpdatedByPostId: {
                        ...state.lastUpdatedByPostId,
                        [postId]: Date.now(),
                    },
                };
        }),

    updateComment: (postId, id, partial) =>
        set((state) => ({
            commentsByPostId: {
                ...state.commentsByPostId,
                [postId]: (state.commentsByPostId[postId] || []).map((comment) =>
                    comment.id === id ? { ...comment, ...partial } : comment
                ),
            },
            lastUpdatedByPostId: {
                ...state.lastUpdatedByPostId,
                [postId]: Date.now(),
            },
        })),

    removeComment: (postId, commentId) =>
        set((state) => ({
            commentsByPostId: {
                ...state.commentsByPostId,
                [postId]: (state.commentsByPostId[postId] || []).filter(
                    (comment) => comment.id !== commentId
                ),
            },
            lastUpdatedByPostId: {
                ...state.lastUpdatedByPostId,
                [postId]: Date.now(),
            },
        })),

    clearComments: (postId) =>
        set((state) => {
            const updated = { ...state.commentsByPostId };
            const updatedTimestamps = { ...state.lastUpdatedByPostId };
            delete updated[postId];
            delete updatedTimestamps[postId];
            return {
                commentsByPostId: updated,
                lastUpdatedByPostId: updatedTimestamps,
            };
        }),

    getComments: (postId) => get().commentsByPostId[postId] || [],
}));
