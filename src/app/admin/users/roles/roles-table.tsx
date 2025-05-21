import {AddRoleSheet} from "@/app/admin/users/roles/add-role-sheet";
import {Button} from "@/components/ui/button";
import {DataTable} from "@/components/ui/data-table";
import {rolesColumns} from "@/app/admin/users/roles/roles-columns";
import {useEffect, useState} from "react";
import {RoleSummary} from "@/schemas/user-schema";
import {mockRoles} from "@/app/admin/components/mockData";

export const RolesTable = () => {
    const [data, setData] = useState<RoleSummary[]>([])
    
    useEffect(() => {
        setData(mockRoles)
    }, [])
    
    return (
        <div className={'space-y-4 p-4'}>
            <div className={'w-full flex justify-end'}>
                <AddRoleSheet>
                    <Button>Add new role</Button>
                </AddRoleSheet>
            </div>
            <DataTable columns={rolesColumns}
                       data={data}
                       enableRowSelection={true}
            />
        </div>
    )
}