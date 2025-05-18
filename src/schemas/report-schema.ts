import {z} from "zod";
import {UserSummarySchema} from "@/schemas/user-schema";
import {PostSummarySchema} from "@/schemas/post-schema";

const reportSchema = z.object({
    id: z.string(),
    reason: z.string(),
    reporter: UserSummarySchema,
    post: PostSummarySchema.optional(),
    comment: PostSummarySchema.optional(),
    reportedUser: UserSummarySchema.optional(),
    createdAt: z.string(),
})