import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/components/moderation/moderation-table";
import {reportData} from "@/app/admin/components/mockData";
import {UserReportCardList} from "@/app/admin/users/reports/user-report-card-list";
import {UserReportChart} from "@/app/admin/users/reports/user-report-chart";

export const UserReportContainer = () => {
    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'User Reports'}/>
            <UserReportCardList/>
            <UserReportChart/>
            <ModerationTable data={[reportData[2]]}/>
        </div>
    );
}