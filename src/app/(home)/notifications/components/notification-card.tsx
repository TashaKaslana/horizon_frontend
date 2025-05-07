"use client";

import React, {JSX} from "react";
import {AtSign, Bell, FileText, Heart, MessageCircle, UserPlus} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {NotificationMainCard} from "@/app/(home)/notifications/components/notification-main-card";
import {NotificationCardAction} from "@/app/(home)/notifications/components/notification-card-action";
import {NotificationCardAppearance} from "@/app/(home)/notifications/components/notification-card-appearance";
import {getGroupType, getNotificationTypeInfo} from "@/app/(home)/notifications/libs/notification-data";
import {Notification} from "@/types/Notification";
import {useNotification} from "@/app/(home)/notifications/hooks/useNotification";

interface NotificationCardProps {
    notification: Notification;
}

const NotificationCard = ({notification}: NotificationCardProps) => {
    const {handleToggleReadStatus, handleDeleteNotification} = useNotification()
    const typeInfo = getNotificationTypeInfo(notification.type);

    const icons: Record<"post" | "like" | "comment" | "mention" | "follow" | "system", JSX.Element> = {
        post: <FileText className={`h-5 w-5 ${typeInfo.color}`}/>,
        like: <Heart className={`h-5 w-5 ${typeInfo.color}`}/>,
        comment: <MessageCircle className={`h-5 w-5 ${typeInfo.color}`}/>,
        mention: <AtSign className={`h-5 w-5 ${typeInfo.color}`}/>,
        follow: <UserPlus className={`h-5 w-5 ${typeInfo.color}`}/>,
        system: <Bell className={`h-5 w-5 ${typeInfo.color}`}/>,
    };

    return (
        <Card className={`transition-all ${notification.isRead ? typeInfo.bgColor : "bg-muted/30"} 
                    border-l-4 ${notification.isRead ? "border-l-muted-foreground/30" : typeInfo.borderColor}`}>
            <CardContent className="p-4 relative">
                {!notification.isRead && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"
                                 title="Unread notification"/>}

                <main className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <NotificationCardAppearance user={notification.senderUser} icons={icons} type={notification.type}/>

                        <NotificationMainCard notification={notification}
                                              isRead={notification.isRead}
                                              icons={icons}
                                              typeInfo={typeInfo}
                        />
                    </div>

                    <NotificationCardAction onToggleRead={() => handleToggleReadStatus(notification.id, notification.isRead)}
                                            isRead={notification.isRead}
                                            onDismiss={() => handleDeleteNotification(notification.id)}
                                            type={getGroupType(notification.type)}
                    />
                </main>
            </CardContent>
        </Card>
    );
};

export default NotificationCard;