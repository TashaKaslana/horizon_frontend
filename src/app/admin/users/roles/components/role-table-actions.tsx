import {FloatingBarAction} from "@/components/common/floating-bar";
import {Download, Pencil, Trash} from "lucide-react";
import {exportToExcel} from "@/lib/utils";
import {RoleDto} from "@/api/client";
import React, {useCallback, useMemo, useState} from "react";
import {PermissionsSelectionDialog} from "./permissions-selection-dialog";
import {useRolesManagement} from "@/app/admin/users/roles/hooks/useRolesManagement";
import {useTranslations} from "next-intl";

export const useRoleTableAction = (items: RoleDto[]): FloatingBarAction[] => {
    const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
    const {bulkDeleteRolesHandler} = useRolesManagement();
    const t = useTranslations("Admin.users.roles.table.actions");

    const itemsIds = useMemo(() => {
        return items.map(item => item.id!);
    }, [items]);
    
    const handleConfirm = useCallback((permissionIds: string[]) => {
        console.log(`Assigned permissions to roles: `, permissionIds);
        // Here you would implement the API call to update the role's permissions
    }, []);
    
    return useMemo(() => [
        {
            // label: t("assignPermissions"),
            variant: "default",
            icon: <Pencil/>,
            onClick: () => setPermissionDialogOpen(true),
            renderDialog: () => <PermissionsSelectionDialog
                open={permissionDialogOpen}
                onOpenChangeAction={setPermissionDialogOpen}
                onConfirmAction={handleConfirm}
            />,
        },
        {
            label: t("export"),
            onClick: () => exportToExcel(items, "roles.xlsx", t("rolesExportFileName")),
            variant: "outline",
            icon: <Download/>
        },
        {
            label: t("delete"),
            onClick: async () => bulkDeleteRolesHandler(itemsIds),
            variant: "destructive",
            icon: <Trash/>
        },
    ], [bulkDeleteRolesHandler, handleConfirm, items, itemsIds, permissionDialogOpen, t]);  // Added t to dependencies
}