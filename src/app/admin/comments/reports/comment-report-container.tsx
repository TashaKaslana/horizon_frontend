import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/components/moderation/moderation-table";
import {reportData} from "@/app/admin/components/mockData";
import {CommentReportChart} from "@/app/admin/comments/reports/comment-report-chart";
import {CommentReportCardList} from "@/app/admin/comments/reports/comment-report-card-list";

export const CommentReportContainer = () => {
    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'Comment Reports'}/>
            <CommentReportCardList/>
            <CommentReportChart/>
            <ModerationTable data={[reportData[1]]}/>
        </div>
    );
}