'use client'
import {client} from '@/api/client/client.gen';

import {useAuthTokenStore} from '@/stores/useTokenStore';
import {useInterceptorStore} from "@/stores/useInterceptorStore";

/**
 * Returns the current language code from the `locale` cookie.
 * Converts 'vn' to 'vi'. Defaults to 'en' if not found or on error.
 * Hmmm that is for localizing in backend, it used country code so don't confuse it
 */
export const getCurrentLanguage = async (): Promise<string> => {
    try {
        // For client-side, read from document.cookie
        if (typeof window !== 'undefined') {
            const cookies = document.cookie.split(';');
            const localeCookie = cookies.find(cookie => cookie.trim().startsWith('locale='));
            let lang = localeCookie ? localeCookie.split('=')[1].trim() : 'en';
            if (lang === 'vn') lang = 'vi';
            return lang;
        }

        return 'en';
    } catch (error) {
        console.error('Error getting language from cookie:', error);
        return 'en';
    }
};

export const setupAxiosAuthInterceptor = async () => {
    try {
        await useAuthTokenStore.getState().loadToken();

        client.instance.interceptors.request.use(async (config) => {
            const token = useAuthTokenStore.getState().token;
            if (token) {
                config.headers.set('Authorization', `Bearer ${token}`);
            }

            config.headers['X-Language'] = await getCurrentLanguage();

            return config;
        });
    } finally {
        useInterceptorStore.getState().setInitialized(true);
    }
};

export const setupClientInterceptorsResponse = () => {
    client.instance.interceptors.response.use(
        (response) => {
            if (response.status === 204) {
                return response;
            }

            const res = response.data;

            if (!res?.success && ![200, 201].includes(response.status)) {
                return Promise.reject({
                    message: res?.message ?? 'Unexpected error',
                    error: res?.error,
                    status: res?.error?.status,
                    path: res?.error?.path,
                    fieldErrors: res?.error?.fieldErrors,
                    globalErrors: res?.error?.globalErrors,
                });
            }

            if (![200, 201, 204].includes(response.status)) {
                response.data = {
                    data: res.data?.data,
                    message: res.data?.message,
                    metadata: res.data?.metadata,
                    timestamp: res.data?.timestamp,
                };
            }

            return response;
        },
        (error) => {
            return Promise.reject({
                message: error.message,
                status: error.response?.status,
                error: error.response?.data,
            });
        }
    );
};
