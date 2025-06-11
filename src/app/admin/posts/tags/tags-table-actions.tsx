import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import { TagWithCountDto } from "@/api/client";
import { useTagManagement } from "@/app/admin/posts/tags/hooks/useTagManagement";
import { useTranslations } from "next-intl";

export const useTagTableActions = (items: TagWithCountDto[]): FloatingBarAction[] => {
  const { bulkRemoveTags } = useTagManagement();
  const t = useTranslations("Admin.posts.tags.table");
  const itemsIds = items.map((item) => item.id!);

  return [
    {
      label: t("export"),
      onClick: () => exportToExcel(items, "tags.xlsx", t("tagsExportFileName")),
      variant: "outline",
      icon: <Download />,
    },
    {
      label: t("delete"),
      onClick: () => bulkRemoveTags(itemsIds),
      variant: "destructive",
      icon: <Trash />,
    },
  ];
};
