export interface Notification {
  id: string
  type: NotificationCategory
  title: string
  message: string
  timestamp: string
  read: boolean
  status?: "success" | "error" | "warning" | "info"
  progress?: number
  actions?: string[]
  user?: {
    name: string
    avatar?: string
  }
  contentId?: string
  contentType?: "post" | "comment" | "story" | "video"
}

export type NotificationCategory = "post" | "like" | "comment" | "mention" | "follow" | "system"

export const notifications: Notification[] = [
  {
    id: "1",
    type: "system",
    title: "Account Settings Updated",
    message: "Your account settings were updated successfully.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    read: false,
    status: "success",
  },
  {
    id: "2",
    type: "system",
    title: "New Feature Available",
    message: "Check out our new collaboration tools in the dashboard.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    actions: ["Learn More"],
  },
  {
    id: "3",
    type: "system",
    title: "Storage Limit Warning",
    message: "You're approaching your storage limit. Consider upgrading your plan.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: true,
    status: "warning",
    actions: ["Upgrade Plan"],
  },
  {
    id: "4",
    type: "like",
    title: "New Like",
    message: "Sarah and 30 others liked your post 'My summer vacation'",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false,
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    contentId: "post-123",
    contentType: "post",
  },
  {
    id: "5",
    type: "like",
    title: "New Like",
    message: "Michael and 5 others liked your comment",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    read: true,
    user: {
      name: "Michael Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    contentId: "comment-456",
    contentType: "comment",
  },
  {
    id: "6",
    type: "comment",
    title: "New Comment",
    message: "Alex commented on your post: 'This looks amazing! Where was this taken?'",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    read: false,
    user: {
      name: "Alex Wong",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    contentId: "post-789",
    contentType: "post",
    actions: ["Reply", "View"],
  },
  {
    id: "7",
    type: "comment",
    title: "New Reply",
    message: "Jessica replied to your comment: 'I completely agree with you!'",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    read: false,
    user: {
      name: "Jessica Lee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    contentId: "comment-321",
    contentType: "comment",
    actions: ["Reply", "View"],
  },
  {
    id: "8",
    type: "mention",
    title: "New Mention",
    message: "David mentioned you in a comment: '@user check out this new feature!'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    read: false,
    user: {
      name: "David Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    contentId: "comment-654",
    contentType: "comment",
    actions: ["View"],
  },
  {
    id: "9",
    type: "mention",
    title: "New Mention",
    message: "Emma mentioned you in a post: 'Hanging out with @user today!'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    read: true,
    user: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    contentId: "post-987",
    contentType: "post",
    actions: ["View"],
  },
  {
    id: "10",
    type: "follow",
    title: "New Follower",
    message: "Ryan started following you",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    read: false,
    user: {
      name: "Ryan Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    actions: ["Follow Back", "View Profile"],
  },
  {
    id: "11",
    type: "follow",
    title: "New Follower",
    message: "Olivia started following you",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    read: true,
    user: {
      name: "Olivia Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    actions: ["Follow Back", "View Profile"],
  },
  {
    id: "12",
    type: "system",
    title: "Security Alert",
    message: "Unusual login detected from a new device. Please verify it was you.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    read: false,
    status: "error",
    actions: ["Verify", "Secure Account"],
  },
  {
    id: "13",
    type: "post",
    title: "Video Upload Complete",
    message: "Your video 'Project Overview.mp4' has been successfully uploaded.",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
    read: false,
    status: "success",
    contentType: "video",
    contentId: "video-123",
    actions: ["View", "Share"],
  },
  {
    id: "14",
    type: "post",
    title: "Post Published",
    message: "Your post 'New Product Announcement' has been published.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    read: true,
    status: "success",
    contentType: "post",
    contentId: "post-456",
    actions: ["View Stats", "Boost Post"],
  },
  {
    id: "15",
    type: "post",
    title: "Video Processing",
    message: "Your video 'Product Demo.mp4' is currently being processed.",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    read: false,
    progress: 65,
    contentType: "video",
    contentId: "video-789",
  },
]

export function getNotificationTypeInfo(type: Notification["type"]) {
  switch (type) {
    case "post":
      return {
        icon: "file-text",
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        borderColor: "border-l-blue-500",
        label: "Posts",
      }
    case "like":
      return {
        icon: "heart",
        color: "text-red-500",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        borderColor: "border-l-red-500",
        label: "Likes",
      }
    case "comment":
      return {
        icon: "message-circle",
        color: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        borderColor: "border-l-green-500",
        label: "Comments",
      }
    case "mention":
      return {
        icon: "at-sign",
        color: "text-purple-500",
        bgColor: "bg-purple-50 dark:bg-purple-950/20",
        borderColor: "border-l-purple-500",
        label: "Mentions",
      }
    case "follow":
      return {
        icon: "user-plus",
        color: "text-indigo-500",
        bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
        borderColor: "border-l-indigo-500",
        label: "Follows",
      }
    case "system":
      return {
        icon: "bell",
        color: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-950/20",
        borderColor: "border-l-amber-500",
        label: "System",
      }
    default:
      return {
        icon: "bell",
        color: "text-gray-500",
        bgColor: "bg-gray-50 dark:bg-gray-950/20",
        borderColor: "border-l-gray-500",
        label: "Notification",
      }
  }
}

