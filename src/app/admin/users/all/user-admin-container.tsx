import {SiteHeader} from "@/app/admin/components/site-header";
import {UserCardList} from "@/app/admin/users/all/user-card-list";
import {UserAttendanceChart} from "@/app/admin/users/all/user-attending-chart";
import {UserAdminTable} from "@/app/admin/users/all/user-admin-table";

const UserAdminContainer = () => {
    return (
        <div className={'space-y-4'}>
            <SiteHeader text={'Users'}/>
            <UserCardList/>
            <UserAttendanceChart/>
            <UserAdminTable/>
        </div>
    )
}

export default UserAdminContainer;