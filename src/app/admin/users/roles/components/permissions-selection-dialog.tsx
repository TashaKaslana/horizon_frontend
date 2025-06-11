"use client";

import React, {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {PermissionsDataTable} from "@/app/admin/users/permissions/permissions-data-table";
import {RowSelectionState} from "@tanstack/react-table";
import {useTranslations} from "next-intl";

interface PermissionsSelectionDialogProps {
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
    onConfirmAction: (selectedIds: string[]) => void;
    currentPermissionIds?: string[];
}

export const PermissionsSelectionDialog: React.FC<PermissionsSelectionDialogProps> = ({
    open,
    onOpenChangeAction,
    onConfirmAction,
    currentPermissionIds = [],
}) => {
    const t = useTranslations("Admin.users.permissions.selectDialog");
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Initialize row selection based on currentPermissionIds when dialog opens
    useEffect(() => {
        if (open) {
            const initialSelection: RowSelectionState = {};
            currentPermissionIds.forEach(id => {
                initialSelection[id] = true;
            });
            setRowSelection(initialSelection);
        }
    }, [open, currentPermissionIds]);

    const handleConfirm = () => {
        // Extract selected IDs from row selection state
        const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
        onConfirmAction(selectedIds ?? []);
        onOpenChangeAction(false);
    };

    const handleDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            // Optionally reset selection when dialog is closed via X or overlay click
            setRowSelection({});
        }
        onOpenChangeAction(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"> {/* Adjusted width for table */}
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 max-h-[60vh] overflow-y-auto">
                    <PermissionsDataTable
                        rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                        enableRowSelection={true}
                        columnVisibility={{id: false, actions: false}}
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            {t("cancel")}
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleConfirm}>
                        {t("save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
