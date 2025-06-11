import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import {TagWithCountDto} from "@/api/client";
import {useTagManagement} from "@/app/admin/posts/tags/hooks/useTagManagement";

export const useTagTableActions = (items: TagWithCountDto[]): FloatingBarAction[] => {
    const {bulkRemoveTags} = useTagManagement()
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
            onClick: async () => bulkRemoveTags(itemsIds),
            variant: "destructive",
            icon: <Trash />
        },
    ];
};

