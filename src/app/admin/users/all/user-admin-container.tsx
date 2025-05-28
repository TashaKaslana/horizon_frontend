'use client'
import {SiteHeader} from "@/app/admin/components/site-header";
import {UserCardList} from "@/app/admin/users/all/components/user-card-list";
import {UserAttendanceChart} from "@/app/admin/users/all/components/user-attending-chart";
import {UserAdminTable} from "@/app/admin/users/all/components/user-admin-table";
import useUsersManagement from "@/app/admin/users/all/hooks/useUsersManagement";

const UserAdminContainer = () => {
    useUsersManagement()

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