'use client'
import {client} from '@/api/client/client.gen';
import {useEffect} from "react";

export const useSetupClientInterceptorsRequest = () => {
    useEffect(() => {
        const interceptor = client.instance.interceptors.request.use(async (config) => {
            const res = await fetch('/api/token');
            const data = await res.json();
            const token = data.accessToken.token;

            config.headers.set('Authorization', `Bearer ${token}`);
            return config;
        });

        return () => {
            if (interceptor !== undefined) {
                client.instance.interceptors.request.eject(interceptor);
            }
        };
    }, []);
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
