"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {AddPermissionSheet} from "./add-permission-sheet";
import {CreatePermissionRequest} from "@/api/client";
import usePermissionsManagement from "@/app/admin/users/permissions/hooks/usePermissionsManagement";
import {PermissionsDataTable} from "./permissions-data-table";
import {useTranslations} from "next-intl";
import {usePermissionRealtime} from "@/app/admin/users/permissions/hooks/usePermissionRealtime";

export const PermissionsTable = () => {
    const {createPermission} = usePermissionsManagement();
    const t = useTranslations("Admin.users.permissions");
    usePermissionRealtime()

    const handlePermissionAdded = (newPermissionData: CreatePermissionRequest) => {
        createPermission(newPermissionData)
    };

    return (
        <div className={'space-y-4 p-4'}>
            <div className={'w-full flex justify-end'}>
                <AddPermissionSheet onPermissionAdded={handlePermissionAdded}>
                    <Button>{t('addPermissionSheet.buttons.addNew')}</Button>
                </AddPermissionSheet>
            </div>
            <PermissionsDataTable
                enableRowSelection={true}
                columnVisibility={{id: false}}
            />
        </div>
    );
};
