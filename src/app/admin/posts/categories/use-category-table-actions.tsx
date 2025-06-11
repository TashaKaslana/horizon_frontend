import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import {PostCategoryWithCountDto} from "@/api/client";
import {useCategoryManagement} from "@/app/admin/posts/categories/hooks/useCategoryManagement";

export const useCategoryTableActions = (items: PostCategoryWithCountDto[]): FloatingBarAction[] => {
    const {handleBulkDeleteCategories} = useCategoryManagement()
    const itemsIds = items.map(item => item.id!);

    return [
        {
            label: "Export",
            onClick: () => exportToExcel(items, "categories.xlsx", "Categories"),
            variant: "outline",
            icon: <Download />
        },
        {
            label: "Delete",
            onClick: async () => handleBulkDeleteCategories(itemsIds),
            variant: "destructive",
            icon: <Trash />
        },
    ];
};

