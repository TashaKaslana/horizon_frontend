"use client";

import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {DataTable} from "@/components/ui/data-table";
import {permissionsColumns} from "./permissions-columns";
import {PermissionSummary} from "@/schemas/user-schema";
import {mockPermissions} from "@/app/admin/components/mockData";
import {AddPermissionSheet} from "./add-permission-sheet";

export const PermissionsTable = () => {
    const [data, setData] = useState<PermissionSummary[]>([]);

    useEffect(() => {
        setData(mockPermissions);
    }, []);

    const handlePermissionAdded = (newPermission: Omit<PermissionSummary, 'id' | 'created_at'>) => {
        const optimisticPermission: PermissionSummary = {
            ...newPermission,
            id: `perm-${Math.random().toString(36).substring(2, 9)}`,
            created_at: new Date().toISOString(),
        };
        setData(prevData => [optimisticPermission, ...prevData]);
    };

    return (
        <div className={'space-y-4 p-4'}>
            <div className={'w-full flex justify-end'}>
                <AddPermissionSheet onPermissionAdded={handlePermissionAdded}>
                    <Button>Add New Permission</Button>
                </AddPermissionSheet>
            </div>
            <DataTable columns={permissionsColumns}
                       data={data}
                       setData={setData}
                       enableRowSelection={true}
            />
        </div>
    );
};

