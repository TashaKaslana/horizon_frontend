'use client'

import NotificationsView from "@/app/(home)/notifications/components/notifications-view";
import { useTranslations } from "next-intl";
import {ChannelProvider} from "ably/react";
import { useCurrentUser } from "@/stores/useCurrentUser";

export default function NotificationContainer() {
    const t = useTranslations("Home.notifications");
    const { user } = useCurrentUser();

    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                <p className="text-muted-foreground">{t('subtitle')}</p>
            </div>
            <ChannelProvider channelName={`notifications.${user?.id}`}>
                <NotificationsView/>
            </ChannelProvider>
        </div>
    )
}
