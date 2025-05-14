import React from "react";
import {CheckCircle} from "lucide-react";
import {formatDistanceToNow} from "date-fns";
import {Notification} from "@/types/Notification";
import {getGroupType} from "@/app/(home)/notifications/libs/notification-data";

interface NotificationMainCardProps {
    notification: Notification;
    isRead: boolean;
    icons: Record<"post" | "like" | "comment" | "mention" | "follow" | "system", React.JSX.Element>;
    typeInfo: {
        icon: string;
        color: string;
        bgColor: string;
        borderColor: string;
        label: string;
    };
}

export const NotificationMainCard = ({notification, icons, isRead, typeInfo}: NotificationMainCardProps) => {
    return (
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <h3 className="font-medium">{notification.content}</h3>
                <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isRead ? "text-muted-foreground bg-muted" : "text-primary-foreground bg-primary"
                    }`}
                >
                                    {isRead ? "Read" : "New"}
                                </span>
                {notification.status === "success" && (
                    <CheckCircle className="h-5 w-5 text-green-500"/>
                )}
            </div>
            {/*<p className="text-sm text-muted-foreground mt-1">*/}
            {/*    {notification.extraData?.message || "No additional details available."}*/}
            {/*</p>*/}

            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <p>{formatDistanceToNow(new Date(notification.createdAt), {addSuffix: true})}</p>
                <span>•</span>
                <span className="flex items-center gap-1">
                    {icons[getGroupType(notification.type)]}
                    {typeInfo.label}
                </span>
            </div>
        </div>
    );
};