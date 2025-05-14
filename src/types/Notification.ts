import {UserSummary} from "@/types/user";
import {PostSummary} from "@/types/Post";

export interface Notification {
    id: string
    type: NotificationType
    content: string
    senderUser?: UserSummary
    recipientUser: UserSummary
    post?: PostSummary
    comment?: Comment
    extraData?: Record<string, object>
    isRead: boolean
    isDeleted: boolean
    status: NotificationStatus
    createdAt: string
    deletedAt: string | null
}

export type NotificationType =
    | 'LIKE_POST'
    | 'NEW_FOLLOWER'
    | 'UN_FOLLOWER'
    | 'COMMENT_POST'
    | 'LIKE_COMMENT'
    | 'MENTION_COMMENT'
    | 'REPLY_COMMENT'
    | 'REPORT_COMMENT'
    | 'REPORT_POST'
    | 'COMMENT_PINNED'
    | 'SYSTEM_MESSAGE';

export type NotificationStatus = 'success' | 'error' | 'warning' | 'info';

export type NotificationCount = {
    count: number
    unreadCount: number
}

export type NotificationStatistics = {
    allCount: number
    allUnreadCount: number
    stats: Record<GroupType, NotificationCount>
}

export type GroupType =
    | 'like'
    | 'follow'
    | 'comment'
    | 'mention'
    | 'post'
    | 'system';