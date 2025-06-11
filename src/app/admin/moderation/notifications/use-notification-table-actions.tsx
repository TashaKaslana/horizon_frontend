import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Mail, MailOpen, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import {AdminNotificationDto} from "@/api/client";
import {useAdminNotification} from "@/app/admin/moderation/notifications/hooks/useAdminNotification";

export const useNotificationTableActions = (items: AdminNotificationDto[]): FloatingBarAction[] => {
    const {updateNotifications, deleteNotifications} = useAdminNotification()
    const itemsIds = items.map(item => item.id!);

    return [
        {
            label: "Mark as Read",
            onClick: async () => {
                await updateNotifications({
                    notificationIds: itemsIds,
                    isRead: true,
                });
            },
            variant: "default",
            icon: <MailOpen />
        },
        {
            label: "Mark as Unread",
            onClick: async () => {
                await updateNotifications({
                    notificationIds: itemsIds,
                    isRead: false,
                });
            },
            variant: "default",
            icon: <Mail />
        },
        {
            label: "Export",
            onClick: () => exportToExcel(items, "notifications.xlsx", "Notifications"),
            variant: "outline",
            icon: <Download />
        },
        {
            label: "Delete",
            onClick: async () => await deleteNotifications(itemsIds),
            variant: "destructive",
            icon: <Trash />
        },
    ];
};

