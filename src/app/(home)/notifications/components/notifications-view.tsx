"use client"

import React from "react"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import NotificationCard from "./notification-card"
import NotificationHeader from "@/app/(home)/notifications/components/notification-header"
import {useNotificationStore} from "../store/useNotificationStore"
import { notificationTabs } from "../constraints/notification-tab"
import {useNotification} from "@/app/(home)/notifications/hooks/useNotification";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import {getGroupType} from "@/app/(home)/notifications/libs/notification-data";

export default function NotificationsView() {
    const {
        notifications,
        searchQuery,
        activeTab,
        readFilter,
        setActiveTab,
    } = useNotificationStore()

    const {hasNextPage, fetchNextPage, isFetchingNextPage} = useNotification()

    const filteredNotifications = notifications.filter((notification) => {
        if (activeTab !== "all" && getGroupType(notification.type) !== activeTab) return false
        if (readFilter === "read" && !notification.isRead) return false
        if (readFilter === "unread" && notification.isRead) return false
        return !(searchQuery && !notification.content.toLowerCase().includes(searchQuery.toLowerCase()));
    })

    const getTypeCount = (type: string) => {
        if (type === "all") return notifications.length
        return notifications.filter((n) => getGroupType(n.type) === type).length
    }

    const getCurrentTab = () => notificationTabs.find((t) => t.id === activeTab) || notificationTabs[0]

    return (
        <div className="mt-6">
            <NotificationHeader/>

            <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                <div className="overflow-x-auto pb-2">
                    <TabsList className="flex w-max min-w-full mb-2">
                        {notificationTabs.map((tab) => (
                            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                                {tab.icon}
                                <span className="hidden sm:inline">{tab.label}</span>
                                <div className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-xs">
                                    {getTypeCount(tab.id)}
                                </div>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <p className="text-sm text-muted-foreground mb-6">{getCurrentTab().description}</p>

                <InfiniteScroll isLoading={isFetchingNextPage} hasMore={hasNextPage} next={fetchNextPage}>
                    {notificationTabs.map((tab) => (
                        <TabsContent key={tab.id} value={tab.id} className="space-y-4">
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map((notification) => (
                                    <NotificationCard key={notification.id}
                                                      notification={notification}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    {React.cloneElement(tab.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, {
                                        className: "mx-auto h-12 w-12 text-muted-foreground",
                                    })}
                                    <h3 className="mt-4 text-lg font-medium">No {tab.label.toLowerCase()} notifications</h3>
                                    <p className="text-muted-foreground mt-2">You don&#39;t have
                                        any {tab.label.toLowerCase()} notifications at the moment.</p>
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </InfiniteScroll>
            </Tabs>
        </div>
    )
}
