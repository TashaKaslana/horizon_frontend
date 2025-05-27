import {z} from "zod";
import {UserSummarySchema} from "@/schemas/user-schema";
import {PostSummarySchema} from "@/schemas/post-schema";
import {CommentResponseSchema} from "@/schemas/comment-schema";

export const ModerationStatusSchema = z.enum([
    "PENDING",
    "REVIEWED_APPROVED",
    "REVIEWED_REJECTED",
    "ACTIONTAKEN_CONTENTREMOVED",
    "ACTIONTAKEN_USERWARNED",
    "ACTIONTAKEN_USERBANNED",
    "RESOLVED",
]);

export const ModerationItemTypeSchema = z.enum([
    "POST",
    "COMMENT",
    "USER",
]);

export const ReportSchema = z.object({
    id: z.string(),
    reason: z.string(),
    reporter: UserSummarySchema,
    post: PostSummarySchema.optional(),
    comment: CommentResponseSchema.optional(),
    reportedUser: UserSummarySchema.optional(),
    createdAt: z.string(),

    moderatorNotes: z.string().optional(),
    status: ModerationStatusSchema,
    updatedAt: z.string().optional(),
    itemType: z.enum(["Post", "Comment", "User"]),
})

export type ModerationStatus = z.infer<typeof ModerationStatusSchema>;
export type Report = z.infer<typeof ReportSchema>;