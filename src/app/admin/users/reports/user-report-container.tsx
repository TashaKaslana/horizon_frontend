'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/components/moderation/moderation-table";
import {UserReportCardList} from "@/app/admin/users/reports/user-report-card-list";
import {UserReportChart} from "@/app/admin/users/reports/user-report-chart";
import {useUsersReportManagement} from "@/app/admin/users/reports/hooks/useUsersReportManagement";

export const UserReportContainer = () => {
    useUsersReportManagement()

    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'User Reports'}/>
            <UserReportCardList/>
            <UserReportChart/>
            <ModerationTable/>
        </div>
    );
}