import React from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {UserSummary} from "@/types/user";
import {NotificationType} from "@/types/Notification";
import {getGroupType} from "@/app/(home)/notifications/libs/notification-data";

export const NotificationCardAppearance = (props: {
    user?: UserSummary,
    icons: Record<"post" | "like" | "comment" | "mention" | "follow" | "system", React.JSX.Element>,
    type: NotificationType
}) => <>
    {props.user ? (
        <Avatar className="h-10 w-10 border">
            <AvatarImage src={props.user?.profileImage} alt={props.user?.displayName}/>
            <AvatarFallback>{
                props.user.displayName ?
                    props.user?.displayName?.substring(0, 2).toUpperCase() :
                    props.user?.username[0].toUpperCase()
            }</AvatarFallback>
        </Avatar>
    ) : (
        <div className="mt-1">{props.icons[getGroupType(props.type)]}</div>
    )}
</>;