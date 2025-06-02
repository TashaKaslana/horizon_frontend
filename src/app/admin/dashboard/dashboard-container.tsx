'use client';

import {DashboardCardList} from "@/app/admin/dashboard/dashboard-card-list";
import {SiteHeader} from "@/app/admin/components/site-header";
import {DashboardAdminChart} from "@/app/admin/dashboard/dashboard-admin-chart";

const DashboardContainer = () => {
    return (
        <div className={'space-y-4'}>
            <SiteHeader text={'Dashboard'}/>
            <DashboardCardList/>
            <div className={'px-2 lg:px-6'}>
                <DashboardAdminChart />
            </div>
        </div>
    )
}

export default DashboardContainer

