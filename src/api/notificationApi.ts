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
            groupType: (p0.type && p0.type !== 'all')? p0.type : undefined
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
        method: 'patch',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const markAllNotificationsAsRead = async (props: {type?: string}) => {
    const token = await getAccessToken();

    return await apiRequest({
        url: `/notifications/mark-all-as-read`,
        method: 'patch',
        params: {
            type: (props.type && props.type !== 'all')? props.type : undefined
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const unreadAllNotifications = async (props: {type?: string}) => {
    const token = await getAccessToken();

    return await apiRequest({
        url: `/notifications/unmark-all-as-read`,
        method: 'patch',
        params: {
            type: (props.type && props.type !== 'all')? props.type : undefined
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const unreadNotification = async (id: string) => {
    const token = await getAccessToken();

    return await apiRequest({
        url: `/notifications/${id}/unmark-as-read`,
        method: 'patch',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const dismissAllNotifications = async (props: {type?: string}) => {
    const token = await getAccessToken();

    return await apiRequest({
        url: `/notifications/dismiss-all`,
        method: 'DELETE',
        params: {
            type: (props.type && props.type !== 'all')? props.type : undefined
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}