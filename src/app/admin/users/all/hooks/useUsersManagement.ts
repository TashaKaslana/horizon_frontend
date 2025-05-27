'use client'

import {getAllUsersInfiniteOptions} from "@/api/client/@tanstack/react-query.gen"
import {useInfiniteQuery} from "@tanstack/react-query";
import {getNextPageParam} from "@/lib/utils";
import useUsersStore from "@/app/admin/users/all/store/useUsersStore";
import {useEffect} from "react";

const useUsersManagement = () => {
    const {actions} = useUsersStore()
    
    const {data : userListData} = useInfiniteQuery({
        ...getAllUsersInfiniteOptions({
            query: {
                page: 0,
                size: 10,
                sort: ["createdAt", "desc"],
            },
        }),
        getNextPageParam: (lastPage) => {
            return getNextPageParam(lastPage);
        },
        initialPageParam: 0
    })

    useEffect(() => {
        actions.setInfiniteQueryData(userListData)
    }, [actions, userListData]);



    return {

    }
}

export default useUsersManagement;
