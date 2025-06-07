'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/moderation/reports/moderation-table";
import {ModerationChart} from "@/app/admin/moderation/reports/moderation-chart";
import {UserModerationCardList} from "@/app/admin/moderation/reports/moderation-card-list";

export const UserReportContainer = () => {
    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'User Reports'}/>
            <UserModerationCardList/>
            <ModerationChart type={'USER'} isSpecific={true}/>
            <ModerationTable type={"USER"}/>
        </div>
    );
}