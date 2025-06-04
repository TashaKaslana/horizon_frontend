'use client'

import {LogsTable} from "@/app/admin/system/logs/logs-table";
import {SiteHeader} from "@/app/admin/components/site-header";
import {LogErrorChart} from "@/app/admin/system/logs/logs-chart";

export const LogsContainer = () => {
    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'Logs'}/>
            <LogErrorChart/>
            <LogsTable/>
        </div>
    )
}