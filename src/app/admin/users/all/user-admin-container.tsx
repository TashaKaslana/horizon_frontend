'use client'
import {SiteHeader} from "@/app/admin/components/site-header";
import {UserCardList} from "@/app/admin/users/all/components/user-card-list";
import {UserAttendanceChart} from "@/app/admin/users/all/components/user-attending-chart";
import {UserAdminTable} from "@/app/admin/users/all/components/user-admin-table";
import {useTranslations} from "next-intl";
import {ChannelProvider} from "ably/react";

const UserAdminContainer = () => {
    const t = useTranslations('Admin.users');
    return (
        <div className={'space-y-4'}>
            <SiteHeader text={t('title')}/>
            <UserCardList/>
            <UserAttendanceChart/>
            <ChannelProvider channelName={`users`}>
                <UserAdminTable/>
            </ChannelProvider>
        </div>
    )
}

export default UserAdminContainer;