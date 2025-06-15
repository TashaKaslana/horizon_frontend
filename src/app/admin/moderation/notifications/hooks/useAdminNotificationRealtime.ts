import {useChannel} from "ably/react";
import {useCurrentUser} from "@/stores/useCurrentUser";
import useAdminNotificationStore from "@/app/admin/moderation/notifications/stores/useAdminNotificationStore";

export const useAdminNotificationRealtime = () => {
    const {actions} = useAdminNotificationStore();
    const {user} = useCurrentUser();

    useChannel("admin.notifications", (message) => {
        const {name, data, clientId} = message;

        if (clientId === user?.id) return;

        switch (name) {
            case "admin.notification.created":
                actions.addNotifications({...data.notification, id: data.notificationId});
                break;
            case "admin.notification.bulk.updated":
                actions.bulkUpdateReadStatus(data.notificationIds, data.isRead);
                break;
            case "admin.notification.bulk.deleted":
                actions.bulkDeleteNotifications(data.notificationIds);
                break;

            default:
                console.warn(`[Ably] Unknown event "${name}" on admin notifications channel`);
        }
    });
}