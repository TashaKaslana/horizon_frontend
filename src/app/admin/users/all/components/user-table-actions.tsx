import {FloatingBarAction} from "@/components/common/floating-bar";
import {UserAdminData} from "@/app/admin/users/all/components/user-admin-table";
import {Download, Pencil, Trash} from "lucide-react";
import {exportToExcel} from "@/lib/utils";
import {BulkEditUsersDialog} from "@/app/admin/users/all/components/bulk-edit-user-dialog";
import {toast} from "sonner";

export const userTableActions = (items: UserAdminData[]): FloatingBarAction[] => {
    return [
        {
            label: "Edit",
            onClick: () => console.log("Edit action clicked", items),
            variant: "default",
            icon: <Pencil/>,
            renderDialog: (close) => (
                <BulkEditUsersDialog
                    open={true}
                    onOpenChange={close}
                    onSubmit={(values) =>
                        toast.success("Users updated successfully" + JSON.stringify(values))
                    }
                />
            )
        },
        {
            label: "Export",
            onClick: () => exportToExcel(items, "users.xlsx", "Users"),
            variant: "outline",
            icon: <Download/>
        },
        {
            label: "Delete",
            onClick: async () => {
                return new Promise<void>((resolve) =>
                    setTimeout(() => {
                        console.log("Delete action clicked");
                        resolve();
                    }, 2000)
                );
            },
            variant: "destructive",
            icon: <Trash/>
        },
    ];
}