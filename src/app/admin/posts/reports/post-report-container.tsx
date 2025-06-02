'use client';

import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/components/moderation/moderation-table";
import {PostModerationCardList} from "@/app/admin/moderation/reports/moderation-card-list";
import {ModerationChart} from "@/app/admin/moderation/reports/moderation-chart";

export const PostReportContainer = () => {
    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'Post Reports'}/>
            <PostModerationCardList/>
            <ModerationChart type={'POST'} isSpecific={true}/>
            <ModerationTable type={"POST"}/>
        </div>
    );
}