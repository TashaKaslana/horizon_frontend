import {FloatingBarAction} from "@/components/common/floating-bar";
import {Download, Pencil, Trash} from "lucide-react";
import {exportToExcel} from "@/lib/utils";
import {RoleDto} from "@/api/client";
import React, {useCallback, useMemo, useState} from "react";
import {PermissionsSelectionDialog} from "./permissions-selection-dialog";

export const useRoleTableAction = (items: RoleDto[]): FloatingBarAction[] => {
    const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);

    // Memoize the handleConfirm function to avoid recreating it on every render
    const handleConfirm = useCallback((permissionIds: string[]) => {
        console.log(`Assigned permissions to roles: `, permissionIds);
        // Here you would implement the API call to update the role's permissions
    }, []);

    // Use separate component to prevent rerenders of the parent component from causing dialog rerenders
    const PermissionsDialogWrapper = useMemo(() => {
        return (
            <PermissionsSelectionDialog
                open={permissionDialogOpen}
                onOpenChangeAction={setPermissionDialogOpen}
                onConfirmAction={handleConfirm}
            />
        );
    }, [permissionDialogOpen, handleConfirm]);

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
            onClick: async () => {
                return new Promise<void>((resolve) =>
                    setTimeout(() => {
                        console.log("Delete action clicked");
                        resolve();
                    }, 2000)
                );
            },
            variant: "destructive",
            icon: <Trash/>
        },
    ], [handleConfirm, items, permissionDialogOpen]);  // Include all dependencies
}