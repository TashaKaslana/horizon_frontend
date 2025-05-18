import { z } from "zod";
import { DraggableItem } from "@/components/common/dnd-table-components";
import { UserAdminSchema } from "../../users/all/user-admin-table"; // Assuming this path is correct
import { PostSchema } from "../../posts/all/post-schema"; // Assuming this path is correct
import { CommentAdminSchema } from "../../comments/all/comment-admin-table"; // Assuming this path is correct

export const ModerationItemTypeSchema = z.enum(["Post", "Comment", "User"]);
export type ModerationItemType = z.infer<typeof ModerationItemTypeSchema>;

export const ModerationStatusSchema = z.enum([
    "Pending",
    "Reviewed_Approved",
    "Reviewed_Rejected",
    "ActionTaken_ContentRemoved",
    "ActionTaken_UserWarned",
    "ActionTaken_UserBanned",
    "Resolved",
]);
export type ModerationStatus = z.infer<typeof ModerationStatusSchema>;

export const ModerationItemSchema = z.object({
    id: z.string(), // Unique ID for the moderation entry itself (e.g., report ID)
    itemId: z.string(), // ID of the actual Post, Comment, or User
    itemType: ModerationItemTypeSchema,
    itemPreview: z.string().optional(), // Short preview of content or user identifier
    itemLink: z.string().optional(), // Direct link to view the item

    // Details of the reported item (can be one of these)
    postDetails: PostSchema.optional(),
    commentDetails: CommentAdminSchema.optional(),
    userDetails: UserAdminSchema.optional(),

    reporterId: z.string().optional(), // User ID of the reporter
    reporterInfo: z.string().optional(), // e.g., "User @username" or "System"
    reason: z.string(),
    reportContext: z.string().optional(), // E.g., specific text highlighted if applicable

    status: ModerationStatusSchema,
    moderatorNotes: z.string().optional(),
    createdAt: z.string(), // Timestamp of the report/flag
    updatedAt: z.string().optional(), // Timestamp of the last moderation action
});

export type ModerationItemData = z.infer<typeof ModerationItemSchema> & DraggableItem;

// Helper function to generate mock data - replace with actual API calls
export const generateMockModerationItem = (
    id: string,
    itemId: string,
    itemType: ModerationItemType,
    status: ModerationStatus,
    daysAgoReported: number,
    itemData?: any
): ModerationItemData => {
    const now = new Date();
    const createdAt = new Date(now.setDate(now.getDate() - daysAgoReported)).toISOString();
    let preview = `Item ${itemId}`;
    if (itemType === "Post" && itemData?.title) preview = itemData.title;
    if (itemType === "Comment" && itemData?.content) preview = itemData.content.substring(0, 50) + "...";
    if (itemType === "User" && itemData?.name) preview = itemData.name;


    return {
        id: `mod-${id}`,
        itemId,
        itemType,
        itemPreview: preview,
        itemLink: `/admin/${itemType.toLowerCase()}s/all?highlight=${itemId}`, // Example link
        reporterId: `user-${Math.floor(Math.random() * 100)}`,
        reporterInfo: `User @reporter${Math.floor(Math.random() * 100)}`,
        reason: `Reason for reporting ${itemType.toLowerCase()} ${itemId}`,
        status,
        createdAt,
        updatedAt: status !== "Pending" ? new Date().toISOString() : undefined,
        postDetails: itemType === "Post" ? itemData : undefined,
        commentDetails: itemType === "Comment" ? itemData : undefined,
        userDetails: itemType === "User" ? itemData : undefined,
    };
};

