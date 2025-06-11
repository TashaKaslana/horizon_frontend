import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import {PermissionDto} from "@/api/client";
import usePermissionsManagement from "@/app/admin/users/permissions/hooks/usePermissionsManagement";
import {useMemo} from "react";
import {useTranslations} from "next-intl";

export const usePermissionTableAction = (items: PermissionDto[]): FloatingBarAction[] => {
  const {bulkRemovePermissions} = usePermissionsManagement();
  const t = useTranslations("Admin.users.permissions.table");
  const itemsIds = useMemo(() => items.map(item => item.id!), [items]);

  return [
    {
      label: t("export"),
      onClick: () => exportToExcel(items, "permissions.xlsx", t("permissionsExportFileName")),
      variant: "outline",
      icon: <Download />
    },
    {
      label: t("delete"),
      onClick: async () => bulkRemovePermissions(itemsIds),
      variant: "destructive",
      icon: <Trash />
    },
  ];
}
