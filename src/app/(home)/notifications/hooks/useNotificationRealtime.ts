import {useChannel} from "ably/react";
import {useCurrentUser} from "@/stores/useCurrentUser";
import {useNotificationStore} from "@/app/(home)/notifications/store/useNotificationStore";

export const useNotificationRealtime = () => {
    const {user} = useCurrentUser()
    const {addNotification, updateNotification, deleteNotification} = useNotificationStore()

    useChannel(`notifications.${user?.id}`, (message) => {
        const {name, data} = message;

        if (name === 'notification.created') {
            addNotification({...data.notification, id: data.notificationId});
        } else if (name === 'notification.updated') {
            const {id, ...updates} = data;
            updateNotification(id, updates);
        } else if (name === 'notification.deleted') {
            deleteNotification(data.notificationId);
        }
    })
}