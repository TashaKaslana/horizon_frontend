import {CommentResponseFull} from "@/schemas/comment-schema";
import {Report} from "@/schemas/report-schema";

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
