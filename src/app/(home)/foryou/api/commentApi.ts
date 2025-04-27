import { apiRequest } from "@/lib/apiRequest"
import { getAccessToken } from "@auth0/nextjs-auth0"
import {UUID} from "node:crypto";
import {CommentCreated, CommentResponse, CommentUpdated, CreateComment, UpdateComment} from "@/types/Comment";

export const getCommentsByPostId = async (postId: UUID, {page = 1, size = 10}) => {
    const token = await getAccessToken()

    return await apiRequest<CommentResponse>({
        url: `/comments/posts/${postId}`,
        method: "GET",
        params: {
            page,
            size,
            sortBy: 'createdAt',
            sortOrder: 'desc',
        },
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}


export const createComment = async (comment: CreateComment) => {
    const token = await getAccessToken()

    return await apiRequest<CommentCreated>({
        url: '/comments',
        method: 'POST',
        data: comment,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const updateComment = async (updateComment: UpdateComment) => {
    const token = await getAccessToken()

    return await apiRequest<CommentUpdated>({
        url: `/comments/${updateComment.id}`,
        method: 'PUT',
        data: updateComment,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const likeComment = async (commentId: UUID) => {
    const token = await getAccessToken()

    return await apiRequest<void>({
        url: `/comments/${commentId}/interactions`,
        method: "POST",
        data: {
            interactionType: 'LIKE'
        },
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const deleteComment = async (commentId: UUID) => {
    const token = await getAccessToken()

    return await apiRequest<void>({
        url: `/comments/${commentId}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const pinComment = async (commentId: UUID) => {
    const token = await getAccessToken()

    return await apiRequest<void>({
        url: `/comments/${commentId}/pin`,
        method: "PATCH",
        data: {
            interactionType: 'PIN'
        },
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const unpinComment = async (commentId: UUID) => {
    const token = await getAccessToken()

    return await apiRequest<void>({
        url: `/comments/${commentId}/unpin`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const reportComment = async (commentId: UUID, reason: string) => {
    const token = await getAccessToken()

    return await apiRequest<void>({
        url: `/comments/reports`,
        method: "POST",
        data: {
            commentId,
            reason
        },
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}