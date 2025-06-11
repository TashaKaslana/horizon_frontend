import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Mail, MailOpen, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import { AdminNotificationDto } from "@/api/client";
import { useAdminNotification } from "@/app/admin/moderation/notifications/hooks/useAdminNotification";
import { useTranslations } from "next-intl";

export const useNotificationTableActions = (items: AdminNotificationDto[]): FloatingBarAction[] => {
  const { updateNotifications, deleteNotifications } = useAdminNotification();
  const t = useTranslations("Admin.moderation.notifications.table");
  const itemsIds = items.map((item) => item.id!);

  return [
    {
      label: t("markAsRead"),
      onClick: async () => {
        await updateNotifications({
          notificationIds: itemsIds,
          isRead: true,
        });
      },
      variant: "default",
      icon: <MailOpen />,
    },
    {
      label: t("markAsUnread"),
      onClick: async () => {
        await updateNotifications({
          notificationIds: itemsIds,
          isRead: false,
        });
      },
      variant: "default",
      icon: <Mail />,
    },
    {
      label: t("export"),
      onClick: () => exportToExcel(items, "notifications.xlsx", t("notificationsExportFileName")),
      variant: "outline",
      icon: <Download />,
    },
    {
      label: t("delete"),
      onClick: async () => await deleteNotifications(itemsIds),
      variant: "destructive",
      icon: <Trash />,
    },
  ];
};
