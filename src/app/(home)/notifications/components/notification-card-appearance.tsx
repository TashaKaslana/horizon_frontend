import {Notification, NotificationCategory} from "@/app/(home)/notifications/libs/notification-data";
import React from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export const NotificationCardAppearance = (props: {
    user: { name: string; avatar?: string } | undefined,
    icons: Record<Notification["type"], React.JSX.Element>,
    type: NotificationCategory
}) => <>
    {props.user ? (
        <Avatar className="h-10 w-10 border">
            <AvatarImage src={props.user.avatar} alt={props.user.name}/>
            <AvatarFallback>{props.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
    ) : (
        <div className="mt-1">{props.icons[props.type]}</div>
    )}
</>;