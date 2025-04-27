import {create} from 'zustand'
import {CommentResponse} from '@/types/Comment'

interface CommentStore {
    comments: CommentResponse[];
    setComments: (comments: CommentResponse[]) => void;
    addComment: (comment: CommentResponse) => void;
    updateComment: (id: string, partial: Partial<CommentResponse>) => void;
    removeComment: (commentId: string) => void;
    clearComments: () => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
    comments: [],
    setComments: (comments) => set({comments}),
    addComment: (comment) => set((state) => ({comments: [comment, ...state.comments]})),
    updateComment: (id, partial) => set((state) => ({
        comments: state.comments.map(comment =>
            comment.id === id ? { ...comment, ...partial } : comment
        )
    })),
    removeComment: (commentId) => set((state) => ({
        comments: state.comments.filter(comment => comment.id !== commentId)
    })),
    clearComments: () => set({comments: []})
}));
