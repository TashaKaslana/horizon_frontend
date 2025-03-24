import { z } from "zod";

export const uploadSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    visibility: z.enum(["private", "unlisted", "public"]),
    category: z.string().min(1, "Category is required"),
    allowComments: z.boolean().default(true),
    ageRestricted: z.boolean().default(false),
    file: z.instanceof(File, { message: "File is required" }),
})