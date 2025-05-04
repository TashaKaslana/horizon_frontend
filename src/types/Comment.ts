import {UserSummary} from "@/types/user";

export interface CommentResponse {
    id: string
    postId: string,
    content: string
    parentCommentId?: string | null
    user: UserSummary
    isAuthorDeleted?: boolean
    isPinned: boolean
    createdAt: string
    updatedAt: string
}

export type CreateComment = Partial<Pick<CommentResponse, 'postId' | 'content' | 'parentCommentId'>>
export type CommentCreated = Pick<CommentResponse, 'id'>

export type UpdateComment = Partial<Pick<CommentResponse, 'id' | 'content'>>
export type CommentUpdated = Pick<CommentResponse, 'id'>

export type CommentWithInteraction = CommentResponse & { isLiked: boolean}