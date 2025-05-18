import { z } from 'zod';
import {UserSummarySchema} from "@/schemas/user-schema";
import {AssetSummarySchema} from "@/schemas/asset-schema";

export const PostVisibilitySchema = z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']); // Adjust if other values are possible
export type PostVisibility = z.infer<typeof PostVisibilitySchema>;

export const PostSchema = z.object({
    id: z.string(),
    createdAt: z.string(), // or z.coerce.date()
    updatedAt: z.string(),
    createdBy: z.string(),
    updatedBy: z.string(),
    user: UserSummarySchema,
    caption: z.string(),
    description: z.string(),
    visibility: PostVisibilitySchema,
    duration: z.number(),
    categoryName: z.string(),
    tags: z.array(z.string()),
    videoPlaybackUrl: z.string().url(),
    videoThumbnailUrl: z.string().url(),
    videoAsset: AssetSummarySchema,
    isAuthorDeleted: z.boolean(),
});

// PostSummary = Omit<Post, 'videoAsset' | 'createdBy' | 'updatedBy' | 'isAuthorDeleted'>
export const PostSummarySchema = PostSchema.omit({
    videoAsset: true,
    createdBy: true,
    updatedBy: true,
    isAuthorDeleted: true,
});

// Inferred types (optional)
export type Post = z.infer<typeof PostSchema>;
export type PostSummary = z.infer<typeof PostSummarySchema>;
