import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Pencil, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";

// TODO: Replace with actual NotificationAdminData type import
// import { NotificationAdminData } from "./notification-admin-table";
type NotificationAdminData = any;

export const notificationTableActions = (items: NotificationAdminData[]): FloatingBarAction[] => {
    return [
        {
            label: "Mark as Read", // Changed from Edit for notifications
            onClick: () => console.log("Mark notification as read action clicked", items),
            variant: "default",
            icon: <Pencil /> // Consider changing icon (e.g., MailOpen)
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

