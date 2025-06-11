import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import {PermissionDto} from "@/api/client";
import usePermissionsManagement from "@/app/admin/users/permissions/hooks/usePermissionsManagement";
import {useMemo} from "react";

export const usePermissionTableAction = (items: PermissionDto[]): FloatingBarAction[] => {
  const {bulkRemovePermissions} = usePermissionsManagement()
  const itemsIds = useMemo(() => items.map(item => item.id!), [items]);

  return [
    {
      label: "Export",
      onClick: () => exportToExcel(items, "permissions.xlsx", "Permissions"),
      variant: "outline",
      icon: <Download />
    },
    {
      label: "Delete",
      onClick: async () => bulkRemovePermissions(itemsIds),
      variant: "destructive",
      icon: <Trash />
    },
  ];
}
