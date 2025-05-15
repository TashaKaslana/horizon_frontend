import {CardList} from "@/app/admin/dashboard/card-list";
import {SiteHeader} from "@/app/admin/components/site-header";
import {UserAttendanceChart} from "@/app/admin/dashboard/user-attending-chart";

const DashboardContainer = () => {
    return (
        <div className={'space-y-4'}>
            <SiteHeader text={'Dashboard'}/>
            <CardList/>
            <div className={'px-2 lg:px-6 '}>
                <UserAttendanceChart/>
            </div>
        </div>
    )
}

export default DashboardContainer