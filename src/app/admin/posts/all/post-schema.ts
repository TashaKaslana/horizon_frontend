"use client"; // If used directly in client components, otherwise not strictly needed for schema

import { z } from "zod";
import { DraggableItem } from "@/components/common/dnd-table-components"; // Assuming this path

export const PostStatusEnum = z.enum(["Draft", "Published", "Archived", "Pending Review"]);
export const PostCategoryEnum = z.enum(["Technology", "Lifestyle", "Travel", "Business", "Art", "Science", "Tutorial"]);

export const PostSchema = z.object({
    id: z.string(), // Using string for ID, could be uuid() in a real app
    title: z.string().min(3, "Title must be at least 3 characters."),
    description: z.string().max(300, "Description must be 300 characters or less.").optional(), // Added description
    content: z.string().min(10, "Content must be at least 10 characters."),
    authorId: z.string(), // Link to a user ID
    authorName: z.string(), // Denormalized for display convenience
    category: PostCategoryEnum,
    status: PostStatusEnum.default("Draft"),
    tags: z.array(z.string()).optional().default([]),
    featuredImage: z.string().url("Invalid URL for featured image.").optional(),
    publishedAt: z.string().datetime({ message: "Invalid date format." }).optional(), // ISO string
    createdAt: z.string().datetime({ message: "Invalid date format." }), // ISO string
    updatedAt: z.string().datetime({ message: "Invalid date format." }), // ISO string
    viewCount: z.number().int().nonnegative("View count must be a non-negative integer.").optional().default(0), // Added viewCount
});

export type PostData = z.infer<typeof PostSchema> & DraggableItem;

// For form state, especially for tags as a string
export const PostFormSchema = PostSchema.extend({
    tagsInput: z.string().optional(), // For handling comma-separated tags in a form
});
export type PostFormData = z.infer<typeof PostFormSchema>;