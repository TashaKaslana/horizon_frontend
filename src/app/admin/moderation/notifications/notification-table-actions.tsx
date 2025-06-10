import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Pencil, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import {AdminNotificationDto} from "@/api/client";

export const notificationTableActions = (items: AdminNotificationDto[]): FloatingBarAction[] => {
    return [
        {
            label: "Mark as Read",
            onClick: () => console.log("Mark notification as read action clicked", items),
            variant: "default",
            icon: <Pencil />
        },
        {
            label: "Export",
            onClick: () => exportToExcel(items, "notifications.xlsx", "Notifications"),
            variant: "outline",
            icon: <Download />
        },
        {
            label: "Delete",
            onClick: async () => {
                return new Promise<void>((resolve) =>
                    setTimeout(() => {
                        console.log("Delete notification action clicked");
                        resolve();
                    }, 2000)
                );
            },
            variant: "destructive",
            icon: <Trash />
        },
    ];
};

