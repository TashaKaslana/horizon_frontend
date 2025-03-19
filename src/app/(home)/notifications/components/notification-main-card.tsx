import {Notification} from "@/app/(home)/notifications/libs/notification-data";
import React from "react";
import {CheckCircle} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {formatDistanceToNow} from "date-fns";

interface NotificationMainCardProps {
    notification: Notification,
    isRead: boolean,
    icons: Record<"post" | "like" | "comment" | "mention" | "follow" | "system", React.JSX.Element>,
    typeInfo: {
        icon: string;
        color: string;
        bgColor: string;
        borderColor: string;
        label: string
    }
}

export const NotificationMainCard = ({notification, icons, isRead, typeInfo} : NotificationMainCardProps) => {
    return <div className="flex-1">
        <div className="flex items-center gap-2">
            <h3 className="font-medium">{notification.title}</h3>
            <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${isRead ? "text-muted-foreground bg-muted" : "text-primary-foreground bg-primary"}`}>
                                    {isRead ? "Read" : "New"}
                                </span>
            {notification.status === "success" && <CheckCircle className="h-5 w-5 text-green-500"/>}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>

        {notification.type === "post" && notification.progress !== undefined && (
            <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                    <span>{notification.progress}% complete</span>
                    {notification.progress === 100 && <span>Complete</span>}
                </div>
                <Progress value={notification.progress} className="h-2"/>
            </div>
        )}

        {notification.actions && (
            <div className="flex gap-2 mt-3">
                {notification.actions.map((action, index) => (
                    <Button key={index} variant="outline" size="sm">
                        {action}
                    </Button>
                ))}
            </div>
        )}

        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <p>{formatDistanceToNow(new Date(notification.timestamp), {addSuffix: true})}</p>
            <span>•</span>
            <span className="flex items-center gap-1">
                                    {icons[notification.type]}
                {typeInfo.label}
                                </span>
        </div>
    </div>;
}