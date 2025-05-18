"use client";

import { z } from "zod";
import {
    LoaderIcon,
    ShieldCheckIcon,
    ShieldXIcon,
    AlertTriangleIcon,
    CheckCircle2Icon,
    ShieldQuestionIcon,
    FileTextIcon,
    MessageSquareIcon,
    UserIcon,
} from "lucide-react";

import { PostSchema } from '../../posts/all/post-schema';
import { UserAdminSchema } from '../../users/all/user-admin-table';
import { CommentAdminSchema } from "../../comments/all/comment-admin-table";
import {
    ModerationItemData,
    ModerationStatusSchema,
    ModerationItemTypeSchema,
    generateMockModerationItem // Assuming this is also in moderation-schema or defined here
} from "./moderation-schema";

// Mock data generation functions
export const mockPostForModeration = (id: string, title: string): z.infer<typeof PostSchema> => ({
    id, title, content: `Content for ${title}`, authorId: `user-${id}`, authorName: `Author ${id}`,
    category: "Technology", status: "Published", createdAt: new Date().toISOString(), viewCount: 100,
    description: `Description for ${title}`, tags: [],
    updatedAt: new Date().toISOString(),
});

export const mockCommentForModeration = (id: string, content: string): z.infer<typeof CommentAdminSchema> => ({
    id, content, authorId: `user-${id}`, authorName: `User ${id}`, authorUsername: `user${id}`,
    authorEmail: `user${id}@example.com`, postId: `post-${id}`, postTitle: `Post Title ${id}`,
    status: "Approved", createdAt: new Date().toISOString(),
});

export const mockUserForModeration = (id: string, name: string): z.infer<typeof UserAdminSchema> => ({
    id, name, username: name.toLowerCase(), email: `${name.toLowerCase()}@example.com`,
    type: "User", status: "Active", createdAt: new Date().toISOString(),
    profileImage: undefined,
    bio: undefined,
    location: undefined,
    website: undefined,
    lastLogin: undefined,
    role: 'User',
    emailVerified: true,
    postsCount: 0,
    commentsCount: 0,
    followersCount: 0,
    followingCount: 0,
});

export const mockModerationData: ModerationItemData[] = [
    generateMockModerationItem("mod001", "post001", "Post", "Pending", 1, mockPostForModeration("post001", "A Post Needing Review")),
    generateMockModerationItem("mod002", "cmt002", "Comment", "Reviewed_Approved", 2, mockCommentForModeration("cmt002", "This comment is fine.")),
    generateMockModerationItem("mod003", "usr003", "User", "ActionTaken_UserWarned", 3, mockUserForModeration("usr003", "WarnedUser123")),
    generateMockModerationItem("mod004", "post004", "Post", "Reviewed_Rejected", 0,     mockPostForModeration("post004", "Inappropriate Post Content")),
    generateMockModerationItem("mod005", "cmt005", "Comment", "Pending", 1, mockCommentForModeration("cmt005", "Questionable comment content here.")),
    generateMockModerationItem("mod006", "usr006", "User", "Pending", 0, mockUserForModeration("usr006", "NewUserReport")),
    generateMockModerationItem("mod007", "post007", "Post", "ActionTaken_ContentRemoved", 5, mockPostForModeration("post007", "Removed Post due to violations")),
    generateMockModerationItem("mod008", "usr008", "User", "ActionTaken_UserBanned", 10, mockUserForModeration("usr008", "BannedUserAccount")),
    generateMockModerationItem("mod009", "cmt009", "Comment", "Resolved", 4, mockCommentForModeration("cmt009", "This was a misunderstanding.")),
];

// Filter options
export const statusFilterOptions = ModerationStatusSchema.options.map(status => ({
    value: status,
    label: status.replace(/_/g, ' '),
    icon: (() => {
        switch (status) {
            case "Pending": return LoaderIcon;
            case "Reviewed_Approved": return ShieldCheckIcon;
            case "Reviewed_Rejected": return ShieldXIcon;
            case "ActionTaken_ContentRemoved":
            case "ActionTaken_UserWarned":
            case "ActionTaken_UserBanned": return AlertTriangleIcon;
            case "Resolved": return CheckCircle2Icon;
            default: return ShieldQuestionIcon;
        }
    })()
}));

export const itemTypeFilterOptions = ModerationItemTypeSchema.options.map(type => ({
    value: type,
    label: type,
    icon: (() => {
        switch (type) {
            case "Post": return FileTextIcon;
            case "Comment": return MessageSquareIcon;
            case "User": return UserIcon;
            default: return ShieldQuestionIcon;
        }
    })()
}));

