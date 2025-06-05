import {AtSign, Bell, FileText, Heart, MessageCircle, UserPlus} from "lucide-react";
import React from "react";
import {useTranslations} from "next-intl";

export const useNotificationTabs = () => {
    const t = useTranslations('Home.notifications.filters');
    const d = useTranslations('Home.notifications.tabDescriptions');
    return [
        {id: "all", label: t('all'), icon: <Bell className="h-4 w-4"/>, description: d('all')},
        {id: "post", label: t('posts'), icon: <FileText className="h-4 w-4"/>, description: d('posts')},
        {id: "like", label: t('likes'), icon: <Heart className="h-4 w-4"/>, description: d('likes')},
        {id: "comment", label: t('comments'), icon: <MessageCircle className="h-4 w-4"/>, description: d('comments')},
        {id: "mention", label: t('mentions'), icon: <AtSign className="h-4 w-4"/>, description: d('mentions')},
        {id: "follow", label: t('follows'), icon: <UserPlus className="h-4 w-4"/>, description: d('follows')},
        {id: "system", label: t('system'), icon: <Bell className="h-4 w-4"/>, description: d('system')},
    ];
};
