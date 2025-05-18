import { z } from 'zod';

export const PostCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.string(),
    updatedBy: z.string(),
});

export type PostCategory = z.infer<typeof PostCategorySchema>;
