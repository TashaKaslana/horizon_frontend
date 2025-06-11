import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import {PostCategoryWithCountDto} from "@/api/client";
import {useCategoryManagement} from "@/app/admin/posts/categories/hooks/useCategoryManagement";
import {useTranslations} from "next-intl";

export const useCategoryTableActions = (items: PostCategoryWithCountDto[]): FloatingBarAction[] => {
    const {handleBulkDeleteCategories} = useCategoryManagement();
    const t = useTranslations("Admin.posts.categories.table");
    const itemsIds = items.map(item => item.id!);

    return [
        {
            label: t("export"),
            onClick: () => exportToExcel(items, "categories.xlsx", t("categoriesExportFileName")),
            variant: "outline",
            icon: <Download />
        },
        {
            label: t("delete"),
            onClick: async () => handleBulkDeleteCategories(itemsIds),
            variant: "destructive",
            icon: <Trash />
        },
    ];
};
