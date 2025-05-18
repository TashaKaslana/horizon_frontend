import { z } from 'zod';
import { UserSummarySchema } from '@/schemas/user-schema';

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
});

export type CommentResponse = z.infer<typeof CommentResponseSchema>;
