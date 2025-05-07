"use client";

import React, {JSX, useCallback, useEffect, useState} from "react";
import {AtSign, Bell, FileText, Heart, MessageCircle, UserPlus} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {useNotificationStore} from "@/app/(home)/notifications/store/useNotificationStore";
import {NotificationMainCard} from "@/app/(home)/notifications/components/notification-main-card";
import {NotificationCardAction} from "@/app/(home)/notifications/components/notification-card-action";
import {NotificationCardAppearance} from "@/app/(home)/notifications/components/notification-card-appearance";
import {getGroupType, getNotificationTypeInfo} from "@/app/(home)/notifications/libs/notification-data";
import {Notification} from "@/types/Notification";

interface NotificationCardProps {
    notification: Notification;
}

const NotificationCard = ({notification}: NotificationCardProps) => {
    const {updateNotificationReadStatus} = useNotificationStore();
    const [isRead, setIsRead] = useState(notification.isRead);
    const [isVisible, setIsVisible] = useState(true);
    const typeInfo = getNotificationTypeInfo(notification.type);

    useEffect(() => {
        setIsRead(notification.isRead);
    }, [notification.isRead]);

    const markAsRead = () => {
        const newReadStatus = !isRead;
        setIsRead(newReadStatus);
        updateNotificationReadStatus(notification.id, newReadStatus);
    };

    const dismissNotification = useCallback(() => {
        setIsVisible(false);
    }, []);

    if (!isVisible) return null;

    const icons: Record<"post" | "like" | "comment" | "mention" | "follow" | "system", JSX.Element> = {
        post: <FileText className={`h-5 w-5 ${typeInfo.color}`}/>,
        like: <Heart className={`h-5 w-5 ${typeInfo.color}`}/>,
        comment: <MessageCircle className={`h-5 w-5 ${typeInfo.color}`}/>,
        mention: <AtSign className={`h-5 w-5 ${typeInfo.color}`}/>,
        follow: <UserPlus className={`h-5 w-5 ${typeInfo.color}`}/>,
        system: <Bell className={`h-5 w-5 ${typeInfo.color}`}/>,
    };

    return (
        <Card className={`transition-all ${isRead ? typeInfo.bgColor : "bg-muted/30"} 
                    border-l-4 ${isRead ? "border-l-muted-foreground/30" : typeInfo.borderColor}`}>
            <CardContent className="p-4 relative">
                {!isRead && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"
                                 title="Unread notification"/>}

                <main className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <NotificationCardAppearance user={notification.senderUser} icons={icons} type={notification.type}/>

                        <NotificationMainCard notification={notification}
                                              isRead={isRead}
                                              icons={icons}
                                              typeInfo={typeInfo}
                        />
                    </div>

                    <NotificationCardAction onToggleRead={markAsRead}
                                            isRead={isRead}
                                            onDismiss={dismissNotification}
                                            type={getGroupType(notification.type)}
                    />
                </main>
            </CardContent>
        </Card>
    );
};

export default NotificationCard;