'use client';

import {SiteHeader} from "@/app/admin/components/site-header";
import {PostReportCardList} from "@/app/admin/posts/reports/post-report-card-list";
import {PostReportChart} from "@/app/admin/posts/reports/post-report-chart";
import {ModerationTable} from "@/app/admin/components/moderation/moderation-table";
import {searchReportsInfiniteOptions} from "@/api/client/@tanstack/react-query.gen";

export const PostReportContainer = () => {
    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'Post Reports'}/>
            <PostReportCardList/>
            <PostReportChart/>
            <ModerationTable options={{
                options: searchReportsInfiniteOptions({
                    query: {
                        page: 0,
                        size: 10,
                        itemType: 'POST',
                    }
                })
            }}/>
        </div>
    );
}