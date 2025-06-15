'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {NotificationAdminCards} from "@/app/admin/moderation/notifications/notification-admin-cards";
import {NotificationChart} from "@/app/admin/moderation/notifications/notification-chart";
import {NotificationAdminTable} from "@/app/admin/moderation/notifications/notification-admin-table";
import {useAdminNotification} from "@/app/admin/moderation/notifications/hooks/useAdminNotification";
import {useTranslations} from "next-intl";
import {ChannelProvider} from "ably/react";

export const NotificationAdminContainer = () => {
    useAdminNotification()
    const t = useTranslations("Admin.moderation.notifications");

    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={t('title')}/>
            <NotificationAdminCards/>
            <NotificationChart/>
            <ChannelProvider channelName={'admin.notifications'}>
                <NotificationAdminTable/>
            </ChannelProvider>
        </div>
    )
}