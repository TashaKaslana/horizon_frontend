import { z } from 'zod';
import { UserSummarySchema } from '@/schemas/user-schema';
import {PostSummary} from "@/schemas/post-schema";

export const CommentStatus = z.enum(["Approved", "Pending", "Spam", "Rejected"])

export const CommentResponseSchema = z.object({
    id: z.string(),
    postId: z.string(),
    content: z.string(),
    parentCommentId: z.string().nullable().optional(),
    user: UserSummarySchema,
    isAuthorDeleted: z.boolean().optional(),
    isPinned: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),

    status: CommentStatus.default("Pending"),
});

export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type CommentResponseFull = Omit<z.infer<typeof CommentResponseSchema>, 'postId'> & {post: PostSummary}
