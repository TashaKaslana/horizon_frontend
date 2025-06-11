import {FloatingBarAction} from "@/components/common/floating-bar";
import {Download, Pencil, Trash} from "lucide-react";
import {exportToExcel} from "@/lib/utils";
import {RoleDto} from "@/api/client";
import React, {useCallback, useMemo, useState} from "react";
import {PermissionsSelectionDialog} from "./permissions-selection-dialog";
import {useRolesManagement} from "@/app/admin/users/roles/hooks/useRolesManagement";

export const useRoleTableAction = (items: RoleDto[]): FloatingBarAction[] => {
    const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
    const {bulkDeleteRolesHandler} = useRolesManagement()

    const itemsIds = useMemo(() => {
        return items.map(item => item.id!);
    }, [items]);
    
    const handleConfirm = useCallback((permissionIds: string[]) => {
        console.log(`Assigned permissions to roles: `, permissionIds);
        // Here you would implement the API call to update the role's permissions
    }, []);
    
    return useMemo(() => [
        {
            // label: "Assign Permissions",
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
            label: "Export",
            onClick: () => exportToExcel(items, "roles.xlsx", "Roles"),
            variant: "outline",
            icon: <Download/>
        },
        {
            label: "Delete",
            onClick: async () => bulkDeleteRolesHandler(itemsIds),
            variant: "destructive",
            icon: <Trash/>
        },
    ], [bulkDeleteRolesHandler, handleConfirm, items, itemsIds, permissionDialogOpen]);  // Include all dependencies
}