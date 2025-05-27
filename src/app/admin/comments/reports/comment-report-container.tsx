'use client';

import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/components/moderation/moderation-table";
import {CommentReportChart} from "@/app/admin/comments/reports/comment-report-chart";
import {CommentReportCardList} from "@/app/admin/comments/reports/comment-report-card-list";
import {searchReportsInfiniteOptions} from "@/api/client/@tanstack/react-query.gen";

export const CommentReportContainer = () => {
    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'Comment Reports'}/>
            <CommentReportCardList/>
            <CommentReportChart/>
            <ModerationTable options={{
                options: searchReportsInfiniteOptions({
                    query: {
                        page: 0,
                        size: 10,
                        itemType: 'COMMENT',
                    }
                })
            }}/>
        </div>
    );
}