'use client';

import {SiteHeader} from "@/app/admin/components/site-header";
import { StatusContainer } from "./components/status-container";
import {useTranslations} from "next-intl";

export function AdminStatusContainer() {
    const t = useTranslations('Admin.system.status');

    return <div className={"h-screen"}>
        <SiteHeader text={t('title')}/>
        <StatusContainer/>
    </div>;
}