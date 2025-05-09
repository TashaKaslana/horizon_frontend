import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import React from "react";
import {getUserOverviewById} from "@/api/userApi";

const Layout = async ({
                    children,
                    params,
                }: {
    children: React.ReactNode
    params: { userId: string }
}) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['user-overview', params.userId],
        queryFn: () => getUserOverviewById(params.userId),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className={'h-screen'}>
                {children}
            </div>
        </HydrationBoundary>
    )
}

export default Layout