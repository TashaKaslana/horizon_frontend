'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/components/moderation/moderation-table";
import {UserReportCardList} from "@/app/admin/users/reports/user-report-card-list";
import {UserReportChart} from "@/app/admin/users/reports/user-report-chart";
import {searchReportsInfiniteOptions} from "@/api/client/@tanstack/react-query.gen";

export const UserReportContainer = () => {
    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'User Reports'}/>
            <UserReportCardList/>
            <UserReportChart/>
            <ModerationTable options={{
                options: searchReportsInfiniteOptions({
                    query: {
                        page: 0,
                        size: 10,
                        itemType: 'USER',
                    }
                })
            }}/>
        </div>
    );
}