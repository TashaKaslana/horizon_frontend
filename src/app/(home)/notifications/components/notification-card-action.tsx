import {Button} from "@/components/ui/button";
import {MoreVertical, X} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import React from "react";
import { useTranslations } from "next-intl";

export const NotificationCardAction = ({onToggleRead, isRead, onDismiss, type}: {
    onToggleRead: () => void;
    isRead: boolean;
    onDismiss: () => void;
    type: "post" | "like" | "comment" | "mention" | "follow" | "system";
}) => {
    const t = useTranslations('Home.notifications.cardActions');

    return (
        <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onDismiss}>
                <X className="h-4 w-4"/>
                <span className="sr-only">{t('dismiss')}</span>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4"/>
                        <span className="sr-only">{t('moreOptions')}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onToggleRead}>
                        {isRead ? t('markAsUnread') : t('markAsRead')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDismiss}>{t('dismiss')}</DropdownMenuItem>
                    <DropdownMenuItem>
                        {t('disableNotifications', { type })}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
