import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Pencil, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";

// TODO: Replace with actual CategoryAdminData type import
// import { CategoryAdminData } from "./category-admin-table";
type CategoryAdminData = any;

export const categoryTableActions = (items: CategoryAdminData[]): FloatingBarAction[] => {
    return [
        {
            label: "Edit",
            onClick: () => console.log("Edit category action clicked", items),
            variant: "default",
            icon: <Pencil />
        },
        {
            label: "Export",
            onClick: () => exportToExcel(items, "categories.xlsx", "Categories"),
            variant: "outline",
            icon: <Download />
        },
        {
            label: "Delete",
            onClick: async () => {
                return new Promise<void>((resolve) =>
                    setTimeout(() => {
                        console.log("Delete category action clicked");
                        resolve();
                    }, 2000)
                );
            },
            variant: "destructive",
            icon: <Trash />
        },
    ];
};

