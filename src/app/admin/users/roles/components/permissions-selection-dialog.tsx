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
import {PermissionDto} from "@/api/client"; // Assuming PermissionDto is exported from here
import {RowSelectionState} from "@tanstack/react-table";
import {DraggableItem} from "@/components/common/dnd-table-components";

type PermissionDraggable = PermissionDto & DraggableItem;

interface PermissionsSelectionDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onConfirm: (selectedIds: string[]) => void,
    currentPermissionIds?: string[],
    setSelectedPermissionsId?: (value: (((prevState: string[]) => string[]) | string[])) => void
    selectedPermissionsId: string[]
}

export const PermissionsSelectionDialog: React.FC<PermissionsSelectionDialogProps> = ({
                                                                                          open,
                                                                                          onOpenChange,
                                                                                          onConfirm,
                                                                                          currentPermissionIds = []
                                                                                      }) => {
    const [rowSelection, setRowSelection] = useState<PermissionDraggable[]>([]);

    useEffect(() => {
        if (open) {
            const initialSelection: RowSelectionState = {};
            // This assumes row IDs in the PermissionsDataTable ARE the permission IDs.
            // This is achieved if PermissionsDataTable uses getRowId: (row) => row.id
            currentPermissionIds.forEach(id => {
                initialSelection[String(id)] = true; // Ensure ID is string for key
            });
        }
    }, [open, currentPermissionIds]);

    const handleConfirm = () => {
        // Convert rowSelection (which is { [rowId: string]: boolean }) to array of permission IDs
        // This assumes rowId in rowSelection is the actual permission ID (as a string)
        const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
        onConfirm(selectedIds);
        onOpenChange(false);
    };

    const handleDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            // Optionally reset selection when dialog is closed via X or overlay click
            // setRowSelection({});
        }
        onOpenChange(isOpen);
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"> {/* Adjusted width for table */}
                <DialogHeader>
                    <DialogTitle>Select Permissions</DialogTitle>
                    <DialogDescription>
                        Choose the permissions to assign to this role. Make sure <code>PermissionsDataTable</code>
                        is adapted to work as a controlled component for selection and uses permission IDs as row IDs.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 max-h-[60vh] overflow-y-auto">
                    {/*
                     PermissionsDataTable needs to be modified to:
                     1. Accept `rowSelection` state prop.
                     2. Accept `onRowSelectionChange` handler prop.
                     3. Use `getRowId: (originalRow) => originalRow.id` in its useReactTable options.
                     4. Ensure `enableRowSelection` prop is handled correctly.
                   */}
                    <PermissionsDataTable
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                        onRowSelectionChange={setRowSelection}
                        enableRowSelection={true}
                        columnVisibility={{id: false, actions: false}}
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleConfirm}>
                        Confirm Selection
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

