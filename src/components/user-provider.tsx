"use client"

import {useMutation, useQuery} from "@tanstack/react-query"
import {useCurrentUser} from "@/stores/useCurrentUser"
import React, {useEffect, useState} from "react"
import {useUser} from "@auth0/nextjs-auth0";
import {createUser, getMe} from "@/api/userApi";
import {usePathname, useRouter} from "next/navigation";
import {toast} from "sonner";

export const UserProvider = ({children}: { children: React.ReactNode }) => {
    const {setUser, user: currentUser} = useCurrentUser()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const {user} = useUser()
    const router = useRouter()
    const pathname = usePathname();

    useEffect(() => {
        setIsAuthenticated(!!user)
    }, [user])

    const {mutate: createUserOnBackend} = useMutation({
        mutationFn: createUser,
        onError: (err) => {
            console.error("Failed to create user:", err);
        },
    });

    const {data, isLoading, isError} = useQuery({
        queryKey: ["currentUser"],
        queryFn: getMe,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
        retry: false,
    })

    useEffect(() => {
        if (data?.data) {
            setUser(data.data)
        }
    }, [data, setUser]);

    useEffect(() => {
        if (
            process.env.NEXT_PUBLIC_SHOULD_CREATE_USER === "true" &&
            isAuthenticated &&
            user?.email &&
            !isLoading &&
            (isError || !data?.data)
        ) {
            createUserOnBackend({
                auth0Id: user.sub,
                email: user.email,
                username: user.nickname || user.name || user.sub,
            });

            toast.success("User created successfully", {
                duration: 8000,
            })
            toast("User needs to fill the profile form. Click to redirect profile edit page...", {
                action: {
                    label: "Go to Profile Edit",
                    onClick: () => {
                        router.push('/profile/edit');
                    },
                },
                duration: 8000,
            });
        }
    }, [user, isAuthenticated, data, isLoading, isError, createUserOnBackend, router])

    useEffect(() => {
        if (currentUser &&
            !currentUser.displayName &&
            !excludedPaths.includes(pathname)
        ) {
            toast("User needs to fill the profile form. Click to redirect profile edit page...", {
                action: {
                    label: "Go to Profile Edit",
                    onClick: () => {
                        router.push('/profile/edit');
                    },
                },
                duration: 8000,
            });
        }
    }, [currentUser, pathname, router]);

    return <>{children}</>
}

const excludedPaths = [
    '/',
    '/profile/edit',
    '/profile',
    '/api/auth/callback',
    '/api/auth/login',
    '/api/auth/logout',
    '/admin'
];