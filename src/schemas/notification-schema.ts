import { z } from 'zod';
import {UserSummarySchema} from "@/schemas/user-schema";
import {PostSummarySchema} from "@/schemas/post-schema";
import {CommentResponseSchema} from "@/schemas/comment-schema";

// Enums
export const NotificationTypeSchema = z.enum([
    'LIKE_POST',
    'NEW_FOLLOWER',
    'UN_FOLLOWER',
    'COMMENT_POST',
    'LIKE_COMMENT',
    'MENTION_COMMENT',
    'REPLY_COMMENT',
    'REPORT_COMMENT',
    'REPORT_POST',
    'COMMENT_PINNED',
    'SYSTEM_MESSAGE',
]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const NotificationStatusSchema = z.enum(['success', 'error', 'warning', 'info']);
export type NotificationStatus = z.infer<typeof NotificationStatusSchema>;

// Notification schema
export const NotificationSchema = z.object({
    id: z.string(),
    type: NotificationTypeSchema,
    content: z.string(),
    senderUser: UserSummarySchema.optional(),
    recipientUser: UserSummarySchema,
    post: PostSummarySchema.optional(),
    comment: CommentResponseSchema.optional(),
    extraData: z.record(z.string(), z.any()).optional(),
    isRead: z.boolean(),
    isDeleted: z.boolean(),
    status: NotificationStatusSchema,
    createdAt: z.string(), // or z.coerce.date()
    deletedAt: z.string().nullable(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const AdminNotificationSchema = z.object({
    id: z.string(),
    title: z.string(),
    message: z.string(),

    type: z.enum([
        "report",
        "system",
        "auth",
        "moderation",
        "error",
        "quota",
    ]),
    severity: z.enum(["info", "warning", "critical"]),

    source: z.string().optional(),

    relatedType: z.enum(["user", "post", "comment", "storage", "auth", "system"]).optional(),
    relatedId: z.string().optional(),

    isRead: z.boolean(),
    createdAt: z.string(),
});

export type AdminNotification = z.infer<typeof AdminNotificationSchema>;

