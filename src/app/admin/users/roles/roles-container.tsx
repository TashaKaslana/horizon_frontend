'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {RolesTable} from "@/app/admin/users/roles/roles-table";
import {useRolesManagement} from "@/app/admin/users/roles/hooks/useRolesManagement";
import {useTranslations} from "next-intl";
import {useRolesRealtime} from "@/app/admin/users/roles/hooks/useRolesRealtime";

export const RolesContainer = () => {
    useRolesManagement()
    const t = useTranslations("Admin.users.roles");
    useRolesRealtime()

    return (
        <div className="space-y-4 ">
            <SiteHeader text={t('title')}/>
            <RolesTable/>
        </div>
    )
}