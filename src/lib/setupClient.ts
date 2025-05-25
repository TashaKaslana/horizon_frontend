import { AXIOS_INSTANCE } from './axiosInstance';
import {AxiosHeaders} from "axios";

export const setupRequestInterceptor = () => {
    AXIOS_INSTANCE.interceptors.request.use(
        async (config) => {
            const res = await fetch('/api/token');
            const data = await res.json();
            const token = data.accessToken?.token;

            if (token) {
                if (config.headers) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                } else {
                    config.headers = new AxiosHeaders({ Authorization: `Bearer ${token}` });
                }
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
};

export const setupResponseInterceptor = () => {
    AXIOS_INSTANCE.interceptors.response.use(
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
