import {AtSign, Bell, FileText, Heart, MessageCircle, UserPlus} from "lucide-react";
import React from "react";

export const notificationTabs = [
    {id: "all", label: "All", icon: <Bell className="h-4 w-4"/>, description: "Shows everything"},
    {
        id: "post",
        label: "Posts",
        icon: <FileText className="h-4 w-4"/>,
        description: "Notifications related to your posts"
    },
    {id: "like", label: "Likes", icon: <Heart className="h-4 w-4"/>, description: "Likes on posts/comments"},
    {
        id: "comment",
        label: "Comments",
        icon: <MessageCircle className="h-4 w-4"/>,
        description: "Comments and replies"
    },
    {id: "mention", label: "Mentions", icon: <AtSign className="h-4 w-4"/>, description: "When you are tagged"},
    {id: "follow", label: "Follows", icon: <UserPlus className="h-4 w-4"/>, description: "New followers"},
    {id: "system", label: "System", icon: <Bell className="h-4 w-4"/>, description: "App updates and warnings"},
]