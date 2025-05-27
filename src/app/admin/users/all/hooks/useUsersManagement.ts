'use client'

import {
    createUserMutation, deleteUserMutation,
    getAllUsersInfiniteOptions, updateUserAccountMutation,
    updateUserInfoMutation
} from "@/api/client/@tanstack/react-query.gen"
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import {getNextPageParam} from "@/lib/utils";
import useUsersStore from "@/app/admin/users/all/store/useUsersStore";
import {useEffect} from "react";
import {updateUserAccount, updateUserInfo} from "@/api/client";
import {updateUserImage} from "@/api/userApi";

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

    const {} = useMutation({
        ...createUserMutation(),
        onSuccess: (data) => {
            actions.addUser(data.data)
        },
    })

    const {} = useMutation({
        ...updateUserInfoMutation(),
        onSuccess: (data) => {
            actions.updateUser(data.data)
        },
    })

    const {} = useMutation({
        ...updateUserAccountMutation(),
        onSuccess: (data) => {
            actions.updateUser(data.data)
        },
    })

    const {} = useMutation({
        ...updateUserImage(),
        onSuccess: (data) => {
            actions.updateUser(data.data)
        },
    })

    const {} = useMutation({
        ...deleteUserMutation(),
        onSuccess: (_, variables) => {
            actions.removeUser(variables.path.id)
        },
    })

    return {

    }
}

export default useUsersManagement;
