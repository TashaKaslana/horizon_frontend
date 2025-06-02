'use client'

import {OverviewList} from "@/app/admin/components/overview-list";
import useDashboardManagement from "@/app/admin/dashboard/hook/useDashboardManagement";
import useDashboardStore from "@/app/admin/dashboard/store/useDashboardStore";

export const DashboardCardList = () => {
    const {overviewData} = useDashboardStore();
    const {isOverviewLoading} = useDashboardManagement();

    return <OverviewList overviewData={overviewData} isLoading={isOverviewLoading} />
}
