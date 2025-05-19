import {SiteHeader} from "@/app/admin/components/site-header";
import {PostReportCardList} from "@/app/admin/posts/reports/post-report-card-list";
import {PostReportChart} from "@/app/admin/posts/reports/post-report-chart";
import {ModerationTable} from "@/app/admin/components/moderation/moderation-table";
import {reportData} from "@/app/admin/components/mockData";

export const PostReportContainer = () => {
    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'Post Reports'}/>
            <PostReportCardList/>
            <PostReportChart/>
            <ModerationTable data={[reportData[0]]}/>
        </div>
    );
}