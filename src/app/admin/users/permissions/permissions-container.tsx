'use client';

import {SiteHeader} from "@/app/admin/components/site-header";
import React from "react";
import {PermissionsTable} from "@/app/admin/users/permissions/permissions-table";
import usePermissionsManagement from "@/app/admin/users/permissions/hooks/usePermissionsManagement";
import {useTranslations} from "next-intl";

export const PermissionsContainer = () => {
    const t = useTranslations("Admin.users.permissions");
    usePermissionsManagement();

    return (
        <div className="space-y-4 ">
            <SiteHeader text={t('title')}/>
            <PermissionsTable/>
        </div>
    )
}