'use client'

import {DataTable} from "@/components/ui/data-table";
import {useNotificationColumns} from "./notification-columns";
import {useEffect, useState} from "react";
import {AdminNotificationDto} from "@/api/client";
import useAdminNotificationsStore from "@/app/admin/moderation/notifications/stores/useAdminNotificationStore";
import {useAdminNotification} from "@/app/admin/moderation/notifications/hooks/useAdminNotification";

export const NotificationAdminTable = () => {
    const [data, setData] = useState<AdminNotificationDto[]>([])
    const {notifications} = useAdminNotificationsStore()
    const {fetchNextPage, isFetchingNextPage, isLoading, hasNextPage} = useAdminNotification();
    const columns = useNotificationColumns()
    
    useEffect(() => {
        setData(notifications)
    }, [notifications])

    return (
        <div className={'p-4'}>
            <DataTable
                columns={columns}
                data={data}
                setData={setData}
                enableRowSelection={true}
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
            />
        </div>
    )
}