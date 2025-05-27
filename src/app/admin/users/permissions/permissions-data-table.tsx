import React, {useEffect, useState} from "react";
import {DataTable} from "@/components/ui/data-table";
import usePermissionsStore from "@/app/admin/users/permissions/stores/usePermissionsStore";
import usePermissionsManagement from "@/app/admin/users/permissions/hooks/usePermissionsManagement";
import {PermissionDto} from "@/api/client";
import {DraggableItem} from "@/components/common/dnd-table-components";
import {permissionsColumns} from "@/app/admin/users/permissions/permissions-columns";
import {
    VisibilityState,
} from "@tanstack/react-table";

type PermissionsDataTableProps = {
    enableRowSelection?: boolean | ((row: any) => boolean);
    setRowSelection?: React.Dispatch<React.SetStateAction<PermissionDraggable[]>>
    columnVisibility?: VisibilityState;
};

type PermissionDraggable = PermissionDto & DraggableItem;

export function PermissionsDataTable({
                                         enableRowSelection = false,
                                         setRowSelection,
                                         columnVisibility = {},
                                     }: PermissionsDataTableProps) {
    const [data, setData] = useState<PermissionDraggable[]>([]);
    const {permissions} = usePermissionsStore();
    const {totalPages, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage} = usePermissionsManagement();

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
            columns={permissionsColumns}
            data={data}
            setData={setData}
            enableRowSelection={enableRowSelection}
            setRowSelectionFn={setRowSelection}
            initialColumnVisibility={columnVisibility}
        />
    );
}
