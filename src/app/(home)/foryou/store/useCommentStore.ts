import { create } from 'zustand';
import { CommentResponse } from '@/types/Comment';

interface CommentMap {
    [postId: string]: CommentResponse[];
}

interface CommentStore {
    commentsByPostId: CommentMap;
    setComments: (postId: string, comments: CommentResponse[]) => void;
    addComment: (postId: string, comment: CommentResponse) => void;
    updateComment: (postId: string, id: string, partial: Partial<CommentResponse>) => void;
    removeComment: (postId: string, commentId: string) => void;
    clearComments: (postId: string) => void;
    getComments: (postId: string) => CommentResponse[];
}

export const useCommentStore = create<CommentStore>((set, get) => ({
    commentsByPostId: {},

    setComments: (postId, comments) =>
        set((state) => ({
            commentsByPostId: { ...state.commentsByPostId, [postId]: comments }
        })),

    addComment: (postId, comment) =>
        set((state) => ({
            commentsByPostId: {
                ...state.commentsByPostId,
                [postId]: [comment, ...(state.commentsByPostId[postId] || [])]
            }
        })),

    updateComment: (postId, id, partial) =>
        set((state) => ({
            commentsByPostId: {
                ...state.commentsByPostId,
                [postId]: (state.commentsByPostId[postId] || []).map(comment =>
                    comment.id === id ? { ...comment, ...partial } : comment
                )
            }
        })),

    removeComment: (postId, commentId) =>
        set((state) => ({
            commentsByPostId: {
                ...state.commentsByPostId,
                [postId]: (state.commentsByPostId[postId] || []).filter(comment => comment.id !== commentId)
            }
        })),

    clearComments: (postId) =>
        set((state) => {
            const updated = { ...state.commentsByPostId };
            delete updated[postId];
            return { commentsByPostId: updated };
        }),

    getComments: (postId) => {
        return get().commentsByPostId[postId] || [];
    }
}));
