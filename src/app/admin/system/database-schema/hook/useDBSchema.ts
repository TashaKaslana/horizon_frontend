'use client'

import {useQuery} from "@tanstack/react-query";
import {getDatabaseSchemaOptions} from "@/api/client/@tanstack/react-query.gen";

const useDBSchema = () => {
    const {data, isLoading} = useQuery({
        ...getDatabaseSchemaOptions(),
    })

    return {
        data: data?.data,
        isLoading,
    }
}

export default useDBSchema