'use client'

import {LogsTable} from "@/app/admin/system/logs/logs-table";
import {SiteHeader} from "@/app/admin/components/site-header";
import {LogErrorChart} from "@/app/admin/system/logs/logs-chart";
import {useTranslations} from "next-intl";

export const LogsContainer = () => {
    const t = useTranslations("Admin.system.logs");

    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={t('title')}/>
            <LogErrorChart/>
            <LogsTable/>
        </div>
    )
}