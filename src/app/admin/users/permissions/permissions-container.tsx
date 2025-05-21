import {SiteHeader} from "@/app/admin/components/site-header";
import React from "react";
import {PermissionsTable} from "@/app/admin/users/permissions/permissions-table";

export const PermissionsContainer = () => {
    return (
        <div className="space-y-4 ">
            <SiteHeader text={'Permissions Management'}/>
            <PermissionsTable/>
        </div>
    )
}