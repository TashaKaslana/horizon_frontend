'use client'

import NotificationsView from "@/app/(home)/notifications/components/notifications-view";

export default function NotificationContainer() {
    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground">View and manage your notification activity</p>
            </div>
            <NotificationsView/>
        </div>
    )
}

