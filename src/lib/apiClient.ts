import axios from 'axios';

const apiClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
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

        return response
    },
    (error) => {
        return Promise.reject({
            message: error.message,
            status: error.response?.status,
            error: error.response?.data,
        });
    }
);

export default apiClient;