'use client';

import {SiteHeader} from "@/app/admin/components/site-header";
import React from "react";
import {PermissionsTable} from "@/app/admin/users/permissions/permissions-table";
import usePermissionsManagement from "@/app/admin/users/permissions/hooks/usePermissionsManagement";

export const PermissionsContainer = () => {
    usePermissionsManagement();

    return (
        <div className="space-y-4 ">
            <SiteHeader text={'Permissions Management'}/>
            <PermissionsTable/>
        </div>
    )
}