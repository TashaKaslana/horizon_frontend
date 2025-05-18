"use client";

import { z } from "zod";
import { DraggableItem } from "@/components/common/dnd-table-components";
import {PostSchema} from "@/schemas/post-schema";

export const PostStatusEnum = z.enum(["Draft", "Published", "Archived", "Pending Review"]);
export const PostCategoryEnum = z.enum(["Technology", "Lifestyle", "Travel", "Business", "Art", "Science", "Tutorial"]);


export type PostData = z.infer<typeof PostSchema> & DraggableItem;

export const PostFormSchema = PostSchema.extend({
    tagsInput: z.string().optional(),
});

export type PostFormData = z.infer<typeof PostFormSchema>;