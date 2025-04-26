import {UserSummary} from "@/types/user";
import {UUID} from "node:crypto";

export interface CommentResponse {
    id: UUID
    postId: UUID,
    content: string
    parentCommentId?: UUID | null
    user: UserSummary
    isAuthorDeleted?: boolean
    createdAt: Date
    updatedAt: Date
}

export type CreateComment = Partial<Pick<CommentResponse, 'postId' | 'content' | 'parentCommentId'>>
export type CommentCreated = Pick<CommentResponse, 'id'>

export type UpdateComment = Partial<Pick<CommentResponse, 'id' | 'content'>>
export type CommentUpdated = Pick<CommentResponse, 'id'>