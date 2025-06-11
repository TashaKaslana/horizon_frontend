import {FloatingBarAction} from "@/components/common/floating-bar";
import {UserAdminData} from "@/app/admin/users/all/components/user-admin-table";
import {Download, Pencil, Trash} from "lucide-react";
import {exportToExcel} from "@/lib/utils";
import {BulkEditUsersDialog} from "@/app/admin/users/all/components/bulk-edit-user-dialog";
import useUsersManagement from "@/app/admin/users/all/hooks/useUsersManagement";
import {BulkUserUpdateRequest} from "@/api/client/types.gen";

export const useUserTableActions = (items: UserAdminData[]): FloatingBarAction[] => {
    const {deleteBulkUsers, bulkUpdateUsers} = useUsersManagement();

    return [
        {
            label: "Edit",
            variant: "default",
            icon: <Pencil/>,
            renderDialog: (close, setIsLoading) => (
                <BulkEditUsersDialog
                    open={true}
                    onOpenChangeAction={close}
                    onSubmitAction={async (values) => {
                        const userIds = items.map(item => item.id);
                        const updateRequest: BulkUserUpdateRequest = {
                            ids: userIds,
                            ...values
                        };

                        setIsLoading(true);
                        await bulkUpdateUsers(updateRequest);
                        setIsLoading(false);
                        close();
                    }}
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
                const userIds = items.map(item => item.id);
                await deleteBulkUsers(userIds);
            },
            variant: "destructive",
            icon: <Trash/>,
        },
    ];
}