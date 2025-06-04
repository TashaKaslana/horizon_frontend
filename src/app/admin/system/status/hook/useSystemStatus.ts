'use client';

import { getSystemStatusOptions } from "@/api/client/@tanstack/react-query.gen";
import {useQuery} from "@tanstack/react-query";

export const useSystemStatus = () => {
    const {data, isLoading} = useQuery({
        ...getSystemStatusOptions(),
    })

    return {
        data: data?.data,
        isLoading,
    }
}