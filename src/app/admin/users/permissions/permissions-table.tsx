"use client";

import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {DataTable} from "@/components/ui/data-table";
import {permissionsColumns} from "./permissions-columns";
import {AddPermissionSheet} from "./add-permission-sheet";
import usePermissionsManagement from "@/app/admin/users/permissions/hooks/usePermissionsManagement";
import {PermissionDto} from "@/api/client";
import {DraggableItem} from "@/components/common/dnd-table-components";

type PermissionDraggable = PermissionDto & DraggableItem;

export const PermissionsTable = () => {
    const [data, setData] = useState<PermissionDraggable[]>([]);
    const {permissions} = usePermissionsManagement();

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

    const handlePermissionAdded = (newPermissionData: Omit<PermissionDto, 'id' | 'created_at'>) => {
        const optimisticDto: PermissionDto = {
            ...newPermissionData,
            id: `perm-${Math.random().toString(36).substring(2, 9)}`,
            createdAt: new Date(),
        };

        const optimisticPermission: PermissionDraggable = optimisticDto as PermissionDraggable;

        setData(prevData => [optimisticPermission, ...prevData]);
    };

    return (
        <div className={'space-y-4 p-4'}>
            <div className={'w-full flex justify-end'}>
                <AddPermissionSheet onPermissionAdded={handlePermissionAdded}>
                    <Button>Add New Permission</Button>
                </AddPermissionSheet>
            </div>
            <DataTable
                columns={permissionsColumns}
                data={data}
                setData={setData}
                enableRowSelection={true}
                initialColumnVisibility={{id: false}}
            />
        </div>
    );
};

