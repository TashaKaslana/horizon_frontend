import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import {PermissionDto} from "@/api/client";

export const permissionTableAction = (items: PermissionDto[]): FloatingBarAction[] => {
  return [
    {
      label: "Export",
      onClick: () => exportToExcel(items, "permissions.xlsx", "Permissions"),
      variant: "outline",
      icon: <Download />
    },
    {
      label: "Delete",
      onClick: async () => {
        return new Promise<void>((resolve) =>
          setTimeout(() => {
            console.log("Delete permissions clicked");
            resolve();
          }, 2000)
        );
      },
      variant: "destructive",
      icon: <Trash />
    },
  ];
}
