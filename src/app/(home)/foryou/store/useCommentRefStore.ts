import {CommentResponse} from "@/types/Comment";
import React from "react";
import {create} from "zustand";

type CommentStore = {
    storedComment: CommentResponse | null
    setStoredComment: (value: CommentResponse) => void
    commentInputRef: React.RefObject<HTMLTextAreaElement> | null
    mode: 'create' | 'update' | 'reply'
    setMode: (mode: 'create' | 'update' | 'reply') => void
}

export const useCommentRefStore = create<CommentStore>()((set) => ({
    storedComment: null,
    setStoredComment: (value) => set({storedComment: value}),
    commentInputRef: null,
    mode: 'create',
    setMode: (mode) => set({mode}),
}))