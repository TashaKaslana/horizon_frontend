'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {RolesTable} from "@/app/admin/users/roles/roles-table";

export const RolesContainer = () => {
    return (
        <div className="space-y-4 ">
            <SiteHeader text={'Roles Management'}/>
            <RolesTable/>
        </div>
    )
}