import {FloatingBar, FloatingBarAction} from "@/components/common/floating-bar";
import {RowSelectionState} from "@tanstack/react-table";
import {UserAdminData} from "@/app/admin/users/all/components/user-admin-table";
import {Download, Pencil, Trash} from "lucide-react";
import {exportToExcel} from "@/lib/utils";

interface UserTableActionsProps {
    items: RowSelectionState,
    data: UserAdminData[]
}

export const UserFloatingBarActions = ({items, data}: UserTableActionsProps) => {
    const selectedItems = data.filter(item => items[item.id]);

    const actions: FloatingBarAction[] = [
        {
            label: "Edit",
            onClick: () => console.log("Edit action clicked", selectedItems),
            variant: "default",
            icon: <Pencil/>
        },
        {
            label: "Export",
            onClick: () => exportToExcel(selectedItems, "users.xlsx", "Users"),
            variant: "outline",
            icon: <Download/>
        },
        {
            label: "Delete",
            onClick: () => console.log("Delete action clicked"),
            variant: "destructive",
            icon: <Trash/>
        },
    ];

    return (
        <FloatingBar
            selectedItems={selectedItems}
            actions={actions}
            // disabled={props.disabled}
            // isLoading={props.isLoading}
        />
    )
}