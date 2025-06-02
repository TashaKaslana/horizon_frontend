'use client';

import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/components/moderation/moderation-table";
import {ModerationChart} from "@/app/admin/moderation/reports/moderation-chart";
import {CommentModerationCardList} from "@/app/admin/moderation/reports/moderation-card-list";

export const CommentReportContainer = () => {
    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'Comment Reports'}/>
            <CommentModerationCardList/>
            <ModerationChart type={'COMMENT'} isSpecific/>
            <ModerationTable type={'COMMENT'}/>
        </div>
    );
}