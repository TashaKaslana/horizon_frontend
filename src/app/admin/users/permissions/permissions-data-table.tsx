import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {DataTable} from "@/components/ui/data-table";
import usePermissionsStore from "@/app/admin/users/permissions/stores/usePermissionsStore";
import usePermissionsManagement from "@/app/admin/users/permissions/hooks/usePermissionsManagement";
import {PermissionDto} from "@/api/client";
import {DraggableItem} from "@/components/common/dnd-table-components";
import {useCreatePermissionsColumns} from "@/app/admin/users/permissions/permissions-columns";
import {
    RowSelectionState,
    VisibilityState,
} from "@tanstack/react-table";
import {usePermissionTableAction} from "@/app/admin/users/permissions/components/permission-table-actions";

type PermissionDraggable = PermissionDto & DraggableItem;

type PermissionsDataTableProps = {
    enableRowSelection?: boolean | ((row: PermissionDraggable) => boolean);
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: Dispatch<SetStateAction<RowSelectionState>>;
    columnVisibility?: VisibilityState;
};

export function PermissionsDataTable({
                                         enableRowSelection = false,
                                         rowSelection,
                                         columnVisibility = {},
                                         onRowSelectionChange
                                     }: PermissionsDataTableProps) {
    const [data, setData] = useState<PermissionDraggable[]>([]);
    const {permissions} = usePermissionsStore();
    const {totalPages, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage} = usePermissionsManagement();
    const columns = useCreatePermissionsColumns()

    useEffect(() => {
        const draggablePermissions: PermissionDraggable[] = permissions.map(permissionFromStore => {
            const permissionDto: PermissionDto = {
                ...permissionFromStore,
                id: String(permissionFromStore.id),
            };
            return permissionDto as PermissionDraggable;
        });
        setData(draggablePermissions);
    }, [permissions]);

    return (
        <DataTable
            pageCount={totalPages}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            columns={columns}
            data={data}
            setData={setData}
            enableRowSelection={enableRowSelection}
            rowSelection={rowSelection}
            setRowSelectionFn={onRowSelectionChange}
            initialColumnVisibility={columnVisibility}
            floatingActions={usePermissionTableAction}
        />
    );
}
