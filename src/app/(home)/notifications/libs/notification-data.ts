import {NotificationType} from "@/types/Notification";

export function getNotificationTypeInfo(type: NotificationType) {
    const groupType = getGroupType(type);

    switch (groupType) {
        case "post":
            return {
                icon: "file-text",
                color: "text-blue-500",
                bgColor: "bg-blue-50 dark:bg-blue-950/20",
                borderColor: "border-l-blue-500",
                label: "Posts",
            }
        case 'like':
            return {
                icon: 'heart',
                color: 'text-red-500',
                bgColor: 'bg-red-50 dark:bg-red-950/20',
                borderColor: 'border-l-red-500',
                label: type === 'LIKE_POST' ? 'Post Likes' : 'Comment Likes',
            };
        case 'follow':
            return {
                icon: type === 'NEW_FOLLOWER' ? 'user-plus' : 'user-minus',
                color: 'text-indigo-500',
                bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
                borderColor: 'border-l-indigo-500',
                label: type === 'NEW_FOLLOWER' ? 'New Followers' : 'Unfollowed',
            };
        case 'comment':
            return {
                icon: type === 'REPLY_COMMENT' ? 'corner-down-right' : type === 'COMMENT_PINNED' ? 'pin' : 'message-circle',
                color: 'text-green-500',
                bgColor: 'bg-green-50 dark:bg-green-950/20',
                borderColor: 'border-l-green-500',
                label: type === 'COMMENT_POST' ? 'Post Comments' : type === 'REPLY_COMMENT' ? 'Comment Replies' : 'Pinned Comments',
            };
        case 'mention':
            return {
                icon: 'at-sign',
                color: 'text-purple-500',
                bgColor: 'bg-purple-50 dark:bg-purple-950/20',
                borderColor: 'border-l-purple-500',
                label: 'Comment Mentions',
            };
        // case 'report':
        //   return {
        //     icon: 'flag',
        //     color: 'text-orange-500',
        //     bgColor: 'bg-orange-50 dark:bg-orange-950/20',
        //     borderColor: 'border-l-orange-500',
        //     label: type === 'REPORT_COMMENT' ? 'Comment Reports' : 'Post Reports',
        //   };
        case 'system':
            return {
                icon: 'bell',
                color: 'text-amber-500',
                bgColor: 'bg-amber-50 dark:bg-amber-950/20',
                borderColor: 'border-l-amber-500',
                label: 'System Messages',
            };
        default:
            return {
                icon: 'bell',
                color: 'text-gray-500',
                bgColor: 'bg-gray-50 dark:bg-gray-950/20',
                borderColor: 'border-l-gray-500',
                label: 'Notification',
            };
    }
}

export const getGroupType = (type: NotificationType) => {
    switch (type) {
        case 'LIKE_POST':
        case 'LIKE_COMMENT':
            return 'like';
        case 'NEW_FOLLOWER':
        case 'UN_FOLLOWER':
            return 'follow';
        case 'REPLY_COMMENT':
        case 'COMMENT_PINNED':
        case "REPORT_COMMENT":
            return 'comment';
        case 'MENTION_COMMENT':
            return 'mention';
        case 'COMMENT_POST':
        case "REPORT_POST":
            return 'post';
        case 'SYSTEM_MESSAGE':
            return 'system';
        default:
            return type;
    }
};


