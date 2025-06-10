import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import {TagWithCountDto} from "@/api/client";

export const tagTableActions = (items: TagWithCountDto[]): FloatingBarAction[] => {
    return [
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

