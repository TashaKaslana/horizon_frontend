'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {NotificationAdminCards} from "@/app/admin/moderation/notifications/notification-admin-cards";
import {NotificationChart} from "@/app/admin/moderation/notifications/notification-chart";
import {NotificationAdminTable} from "@/app/admin/moderation/notifications/notification-admin-table";

export const NotificationAdminContainer = () => {
    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'Notifications'}/>
            <NotificationAdminCards/>
            <NotificationChart/>
            <NotificationAdminTable/>
        </div>
    )
}