import {FloatingBarAction} from "@/components/common/floating-bar";
import {UserAdminData} from "@/app/admin/users/all/components/user-admin-table";
import {Download, Pencil, Trash} from "lucide-react";
import {exportToExcel} from "@/lib/utils";
import {BulkEditUsersDialog} from "@/app/admin/users/all/components/bulk-edit-user-dialog";
import useUsersManagement from "@/app/admin/users/all/hooks/useUsersManagement";
import {BulkUserUpdateRequest} from "@/api/client/types.gen";
import {useTranslations} from "next-intl";

export const useUserTableActions = (items: UserAdminData[]): FloatingBarAction[] => {
    const {deleteBulkUsers, bulkUpdateUsers} = useUsersManagement();
    const t = useTranslations("Admin.users.all.actions");

    return [
        {
            label: t("edit"),
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
            label: t("export"),
            onClick: () => exportToExcel(items, "users.xlsx", t("usersExportFileName")),
            variant: "outline",
            icon: <Download/>
        },
        {
            label: t("delete"),
            onClick: async () => {
                const userIds = items.map(item => item.id);
                await deleteBulkUsers(userIds);
            },
            variant: "destructive",
            icon: <Trash/>,
        },
    ];
}