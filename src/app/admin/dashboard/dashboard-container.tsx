'use client';

import {DashboardCardList} from "@/app/admin/dashboard/dashboard-card-list";
import {SiteHeader} from "@/app/admin/components/site-header";
import {DashboardAdminChart} from "@/app/admin/dashboard/dashboard-admin-chart";
import { useTranslations } from "next-intl";

const DashboardContainer = () => {
    const t = useTranslations('Admin.dashboard');

    return (
        <div className={'space-y-4'}>
            <SiteHeader text={t('title')}/>
            <DashboardCardList/>
            <div className={'px-2 lg:px-6'}>
                <DashboardAdminChart />
            </div>
        </div>
    )
}

export default DashboardContainer

