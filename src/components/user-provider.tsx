"use client"

import {useQuery} from "@tanstack/react-query"
import {useCurrentUser} from "@/stores/useCurrentUser"
import React, {useEffect, useState} from "react"
import {useUser} from "@auth0/nextjs-auth0";
import {getMe} from "@/api/userApi";

export const UserProvider = ({children}: { children: React.ReactNode }) => {
    const {setUser} = useCurrentUser()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const {user} = useUser()

    useEffect(() => {
        if (user) {
            setIsAuthenticated(true)
        } else {
            setIsAuthenticated(false)
        }
    }, [user])

    const {data} = useQuery({
        queryKey: ["currentUser"],
        queryFn: getMe,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
    })

    useEffect(() => {
        if (!data) return
        setUser(data.data)
    }, [data, setUser]);

    return <>{children}</>
}
