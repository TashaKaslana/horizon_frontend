'use client'

import {DataTable} from "@/components/ui/data-table";
import {notificationColumns} from "./notification-columns";
import {useEffect, useState} from "react";
import {NotificationItem} from "@/app/admin/moderation/notifications/types";
import {adminNotifications} from "@/app/admin/components/mockData";

export const NotificationAdminTable = () => {
    const [data, setData] = useState<NotificationItem[]>([])

    useEffect(() => {
        setData(adminNotifications)
    }, [])

    return (
        <div className={'p-4'}>
            <DataTable
                columns={notificationColumns}
                data={data}
                setData={setData}
                enableRowSelection={true}
            />
        </div>

    )
}