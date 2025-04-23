import apiClient from './apiClient';
import { AxiosRequestConfig } from 'axios';
import { RestApiResponse } from '@/types/api';

export const apiRequest = async <T>(config: AxiosRequestConfig) => {
    const res = await apiClient.request<RestApiResponse<T>>(config);

    if (!res.data.success) {
        throw res.data.error;
    }

    return {
        data: res.data.data,
        message: res.data.message,
        metadata: res.data.metadata,
        timestamp: res.data.timestamp,
    };
};
