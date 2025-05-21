import { z } from 'zod';

export const PostCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    createdBy: z.string().optional(),
    updatedBy: z.string().optional(),
});

export type PostCategory = z.infer<typeof PostCategorySchema>;
