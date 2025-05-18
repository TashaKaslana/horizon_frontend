import {z} from "zod";
import {UserSummarySchema} from "@/schemas/user-schema";
import {PostSummarySchema} from "@/schemas/post-schema";

export const ModerationStatusSchema = z.enum([
    "Pending",
    "Reviewed_Approved",
    "Reviewed_Rejected",
    "ActionTaken_ContentRemoved",
    "ActionTaken_UserWarned",
    "ActionTaken_UserBanned",
    "Resolved",
]);

export const reportSchema = z.object({
    id: z.string(),
    reason: z.string(),
    reporter: UserSummarySchema,
    post: PostSummarySchema.optional(),
    comment: PostSummarySchema.optional(),
    reportedUser: UserSummarySchema.optional(),
    createdAt: z.string(),

    moderatorNotes: z.string().optional(),
    status: ModerationStatusSchema,
    updatedAt: z.string().optional(),
})

export type ModerationStatus = z.infer<typeof ModerationStatusSchema>;
export type ReportSchema = z.infer<typeof reportSchema>;