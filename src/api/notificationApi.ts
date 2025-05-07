import { apiRequest } from "@/lib/apiRequest";
import {getAccessToken} from "@auth0/nextjs-auth0";
import {Notification} from "@/types/Notification";

export const getMyAllNotifications = async (p0: { page: number; size: number; type?: string }) => {
    const token = await getAccessToken();

    return await apiRequest<Notification[]>({
        url: '/notifications/my',
        method: 'GET',
        params: {
            page: p0.page,
            size: p0.size,
            type: (p0.type && p0.type !== 'all')? p0.type : undefined
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const deleteNotification = async (id: string) => {
    const token = await getAccessToken();

    return await apiRequest({
        url: `/notifications/${id}/soft`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const markNotificationAsRead = async (id: string) => {
    const token = await getAccessToken();

    return await apiRequest({
        url: `/notifications/${id}/mark-as-read`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}