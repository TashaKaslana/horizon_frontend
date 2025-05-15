import {CardList} from "@/app/admin/dashboard/card-list";
import {SiteHeader} from "@/app/admin/components/site-header";

const DashboardContainer = () => {
    return (
        <div className={'space-y-4'}>
            <SiteHeader text={'Dashboard'}/>
            <CardList/>
        </div>
    )
}

export default DashboardContainer