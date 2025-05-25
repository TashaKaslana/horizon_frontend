import {CommentResponseFull} from "@/schemas/comment-schema";
import { AdminNotification } from "@/schemas/notification-schema";
import {Report} from "@/schemas/report-schema";
import {LogEntry} from "@/schemas/log-schema";
import {PermissionSummary, RoleSummary} from "@/schemas/user-schema";

export const postData = {
    id: 'post-001',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-01T12:00:00Z',
    createdBy: 'user-1',
    updatedBy: 'user-1',
    user: {
        id: 'user-1',
        displayName: 'Alice Wonderland',
        username: 'alice123',
        profileImage: 'https://picsum.photos/seed/alice/100/100',
        coverImage: 'https://picsum.photos/seed/alice-cover/400/200',
        createdAt: '2023-01-01T00:00:00Z',
    },
    caption: 'Mastering Next.js 14 Features',
    description: 'A deep dive into the new Server Actions, metadata routing, and performance improvements.',
    visibility: 'PUBLIC' as const,
    duration: 135,
    categoryName: 'Web Development',
    tags: ['Next.js', 'JavaScript', 'Frontend'],
    videoPlaybackUrl: 'https://cdn.example.com/videos/next14.mp4',
    videoThumbnailUrl: 'https://cdn.example.com/thumbnails/next14.jpg',
    videoAsset: {
        id: 'asset-001',
        publicId: 'videos/next14',
        resourceType: 'video',
        format: 'mp4',
        bytes: 10485760,
        width: 1920,
        height: 1080,
        originalFilename: 'next14.mp4',
        createdAt: '2024-05-01T09:59:00Z',
        createdBy: 'user-1',
    },
    isAuthorDeleted: false,
    status: 'Draft'
};

export const userData = {
    id: 'user-1',
    displayName: 'initialDisplayName' + " (Fetched Full Data)",
    username: "simulated_user_details",
    email: "simulated.details@example.com",
    role: "Admin",
    status: "Active" as const,
    profileImage: "https://avatar.vercel.sh/simulated-full.png",
    coverImage: "https://via.placeholder.com/800x300",
    createdAt: "2023-01-01T10:00:00Z",
    lastLogin: "2024-05-15T12:00:00Z",
}

export const commentData: CommentResponseFull = {
    id: "cmt004",
    content: "Not sure I agree with this point.",
    parentCommentId: "cmt001",
    user: userData,
    post: postData,
    status: "Rejected",
    createdAt: "2024-03-08T16:45:00Z",
    isAuthorDeleted: false,
    isPinned: false,
    updatedAt: "2024-03-09T10:00:00Z",
}

export const reportData: Report[] = [{
    id: "report-001",
    reason: "Inappropriate content",
    reporter: userData,
    post: postData,
    comment: {
        ...commentData,
        postId: "post-1"
    },
    reportedUser: userData,
    createdAt: "2024-05-01T10:00:00Z",
    moderatorNotes: "Needs review",
    status: "Pending" as const,
    updatedAt: "2024-05-01T12:00:00Z",
    itemType: "Post" as const,
},
{
    id: "report-002",
    reason: "Spam content",
    reporter: userData,
    comment: {
        ...commentData,
        postId: "post-1"
    },
    createdAt: "2024-05-01T10:00:00Z",
    moderatorNotes: "Needs review",
    status: "Reviewed_Approved" as const,
    updatedAt: "2024-05-01T12:00:00Z",
    itemType: "Comment" as const,
},
{
    id: "report-003",
    reason: "User harassment",
    reporter: userData,
    reportedUser: userData,
    createdAt: "2024-05-01T10:00:00Z",
    moderatorNotes: "Needs review",
    status: "ActionTaken_UserBanned" as const,
    updatedAt: "2024-05-01T12:00:00Z",
    itemType: "User" as const,
}];

export const mockTagsData = [
  {
    id: "tag-001",
    name: "Next.js",
    slug: "next-js",
    description: "A popular React framework for building server-side rendered and static web applications.",
    postsCount: 120,
    createdAt: "2023-05-10T08:00:00Z",
    updatedAt: "2023-12-01T14:30:00Z",
    createdBy: "user-admin-01",
    updatedBy: "user-editor-02",
  },
  {
    id: "tag-002",
    name: "TypeScript",
    slug: "typescript",
    description: "A superset of JavaScript that adds static typing.",
    postsCount: 250,
    createdAt: "2022-11-20T10:15:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
    createdBy: "user-dev-03",
    updatedBy: "user-dev-03",
  },
  {
    id: "tag-003",
    name: "Tailwind CSS",
    slug: "tailwind-css",
    description: "A utility-first CSS framework for rapidly building custom user interfaces.",
    postsCount: 180,
    createdAt: "2023-02-01T16:45:00Z",
    // updatedAt: undefined, // Example of optional field
    createdBy: "user-designer-04",
    // updatedBy: undefined, // Example of optional field
  },
];

export const adminNotifications : AdminNotification[] = [
    {
        id: "notif-1",
        title: "Post flagged multiple times",
        message: "Post #8493 has been reported 5 times for hate speech.",
        type: "report",
        severity: "warning",
        source: "ModerationService",
        relatedType: "post",
        relatedId: "8493",
        isRead: false,
        createdAt: "2025-05-17T10:45:00Z",
    },
    {
        id: "notif-2",
        title: "High Cloudinary usage",
        message: "Cloudinary storage is at 91% of its capacity.",
        type: "quota",
        severity: "critical",
        source: "StorageService",
        relatedType: "storage",
        relatedId: "cloudinary",
        isRead: false,
        createdAt: "2025-05-17T09:20:00Z",
    },
    {
        id: "notif-3",
        title: "API Gateway downtime",
        message: "API Gateway returned 503 errors for 12 minutes.",
        type: "system",
        severity: "critical",
        source: "GatewayService",
        relatedType: "system",
        relatedId: "gateway",
        isRead: true,
        createdAt: "2025-05-16T22:13:00Z",
    },
];


export const mockActivity: LogEntry[] = [
    {
        id: "log_001",
        timestamp: new Date().toISOString(),
        severity: "info",
        message: "Comment successfully posted",
        source: "CommentService",
        userId: "user_123",
        context: {
            commentId: "cmt_987",
            postId: "post_456"
        }
    },
]

export const mockSystemActivity: LogEntry[] = [
    {
        id: "log_002",
        timestamp: new Date().toISOString(),
        severity: "warning",
        message: "High memory usage detected",
        source: "SystemMonitor",
        userId: undefined,
        context: {
            serverId: "server_01",
            memoryUsage: "85%"
        }
    },
    {
        id: "log_003",
        timestamp: new Date().toISOString(),
        severity: "error",
        message: "Database connection failed",
        source: "DatabaseService",
        userId: undefined,
        context: {
            dbInstanceId: "db_01"
        }
    },
];

export const mockErrors: LogEntry[] = [
    {
        id: "log_004",
        timestamp: new Date().toISOString(),
        severity: "critical",
        message: "Unhandled exception in video processing",
        source: "VideoService",
        userId: "user_456",
        context: {
            videoId: "vid_123",
            errorDetails: "Stack trace here"
        }
    },
    {
        id: "log_005",
        timestamp: new Date().toISOString(),
        severity: "error",
        message: "Failed to send notification email",
        source: "NotificationService",
        userId: undefined,
        context: {
            emailId: "email_789"
        }
    },
];

export const mockRoles : RoleSummary[] = [
    {
        id: "3a2b1c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        name: "Admin",
        slug: "admin",
        description: "Full access to all system features",
        created_at: new Date().toISOString()
    },
    {
        id: "9f8e7d6c-5b4a-3c2d-1e0f-9a8b7c6d5e4f",
        name: "Moderator",
        slug: "moderator",
        description: "Can manage content and users",
        created_at: new Date().toISOString()
    },
    {
        id: "6c5d4b3a-2e1f-0a9b-8c7d-6e5f4a3b2c1d",
        name: "User",
        slug: "user",
        description: "Standard user role with basic access",
        created_at: new Date().toISOString()
    }
];

export const mockPermissions: PermissionSummary[] = [
    {
        id: "abcd1234-5678-90ef-ghij-klmnopqrstuv",
        name: "Create Post",
        slug: "create_post",
        module: "posts",
        description: "Allows user to create new posts",
        createdAt: new Date().toISOString()
    },
    {
        id: "1234abcd-5678-ef90-ghij-klmnopqrstuv",
        name: "Edit User",
        slug: "edit_user",
        module: "users",
        description: "Grants permission to modify user information",
        createdAt: new Date().toISOString()
    },
    {
        id: "ef901234-abcd-5678-ghij-klmnopqrstuv",
        name: "Delete Comment",
        slug: "delete_comment",
        module: "comments",
        description: "Allows removal of user comments",
        createdAt: new Date().toISOString()
    },
    {
        id: "ghij1234-abcd-5678-ef90-klmnopqrstuv",
        name: "View Analytics",
        slug: "view_analytics",
        module: "dashboard",
        description: "Access to view platform analytics and reports",
        createdAt: new Date().toISOString()
    }
];

