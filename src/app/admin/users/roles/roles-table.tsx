import {AddRoleSheet} from "@/app/admin/users/roles/add-role-sheet";
import {Button} from "@/components/ui/button";
import {DataTable} from "@/components/ui/data-table";
import {useRolesColumns} from "@/app/admin/users/roles/roles-columns";
import {useEffect, useState} from "react";
import {RoleDto} from "@/api/client";
import {DraggableItem} from "@/components/common/dnd-table-components";
import useRolesStore from "@/app/admin/users/roles/store/useRolesStore";
import {useTranslations} from "next-intl";

type RoleDraggable = RoleDto & DraggableItem

export const RolesTable = () => {
    const [data, setData] = useState<RoleDraggable[]>([])
    const {roles} = useRolesStore()
    const t = useTranslations("Admin.users.roles");
    const columns = useRolesColumns();

    useEffect(() => {
        setData(roles.map(roleFromStore => {
            const roleDto: RoleDto = {
                ...roleFromStore,
                id: String(roleFromStore.id),
            };
            return roleDto as RoleDraggable;
        }))
    }, [roles])
    
    return (
        <div className={'space-y-4 p-4'}>
            <div className={'w-full flex justify-end'}>
                <AddRoleSheet>
                    <Button>{t('actions.addRole')}</Button>
                </AddRoleSheet>
            </div>
            <DataTable columns={columns}
                       data={data}
                       enableRowSelection={true}
            />
        </div>
    )
}