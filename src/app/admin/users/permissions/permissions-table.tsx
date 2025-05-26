"use client";

import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {DataTable} from "@/components/ui/data-table";
import {permissionsColumns} from "./permissions-columns";
import {AddPermissionSheet} from "./add-permission-sheet";
import {CreatePermissionRequest, PermissionDto} from "@/api/client";
import {DraggableItem} from "@/components/common/dnd-table-components";
import usePermissionsStore from "@/app/admin/users/permissions/stores/usePermissionsStore";
import usePermissionsManagement from "@/app/admin/users/permissions/hooks/usePermissionsManagement";

type PermissionDraggable = PermissionDto & DraggableItem;

export const PermissionsTable = () => {
    const [data, setData] = useState<PermissionDraggable[]>([]);
    const {permissions} = usePermissionsStore();
    const {isLoading, hasNextPage, isFetchingNextPage, fetchNextPage, createPermission} = usePermissionsManagement()

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

    const handlePermissionAdded = (newPermissionData: CreatePermissionRequest) => {
        createPermission(newPermissionData)
    };

    return (
        <div className={'space-y-4 p-4'}>
            <div className={'w-full flex justify-end'}>
                <AddPermissionSheet onPermissionAdded={handlePermissionAdded}>
                    <Button>Add New Permission</Button>
                </AddPermissionSheet>
            </div>
            <DataTable
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                columns={permissionsColumns}
                data={data}
                setData={setData}
                enableRowSelection={true}
                initialColumnVisibility={{id: false}}
            />
        </div>
    );
};

