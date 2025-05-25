import {CreateClientConfig} from '@/api/client/client.gen';

export const createClientConfig: CreateClientConfig = (config) => {
    return {
        ...config,
        baseURL: process.env.NEXT_PUBLIC_API_URL,
    };
};

