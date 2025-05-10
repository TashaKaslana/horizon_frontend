import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import React from "react";
import { getUserIntroduction } from "@/api/userApi";
import { getFollowOverview } from "@/api/followApi";
import UserOverviewHeader from "@/app/(home)/users/[userId]/components/UserOverviewHeader";

const Layout = async ({
                          children,
                          params,
                      }: {
    children: React.ReactNode;
    params: Promise<{ userId: string }>;
}) => {
    const {userId} = await params
    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ['user-intro', userId],
            queryFn: () => getUserIntroduction(userId),
        }),
        queryClient.prefetchQuery({
            queryKey: ['user-follow-overview', userId],
            queryFn: () => getFollowOverview(userId),
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className={'h-screen'}>
                <UserOverviewHeader userId={userId}/>
                {children}
            </div>
        </HydrationBoundary>
    );
};

export default Layout;
