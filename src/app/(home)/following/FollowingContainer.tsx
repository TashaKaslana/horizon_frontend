'use client'

import {FollowingHeader} from "@/app/(home)/following/components/FollowingHeader";
import {Tabs, TabsContent} from "@/components/ui/tabs";
import {FollowerTab} from "@/app/(home)/following/components/FollowerTab";
import {FollowingTab} from "@/app/(home)/following/components/FollowingTab";
import {FollowCardProps} from "@/types/follow";
import useFollowingStore from "@/app/(home)/following/store/useFollowingStore";
import {useEffect} from "react";
import {useInfiniteQuery} from "@tanstack/react-query";
import {getMeFollowers, getMeFollowing} from "@/api/followApi";
import {RestApiResponse} from "@/types/api";
import {useFollowingRealtime} from "@/app/(home)/following/hooks/useFollowingRealtime";
import {ChannelProvider} from "ably/react";
import {useCurrentUser} from "@/stores/useCurrentUser";

const MainFollowingTabs = () => {
    useFollowingRealtime()

    return <main className={"border rounded py-1"}>
        <TabsContent value={"following"} className={"h-[calc(100vh-7rem)]"}>
            <FollowingTab/>
        </TabsContent>
        <TabsContent value={"followers"} className={"h-[calc(100vh-7rem)]"}>
            <FollowerTab/>
        </TabsContent>
    </main>;
};

const FollowingContainer = () => {
    const {setFollowing, setFollowers, setInitialFollowers, setInitialFollowing} = useFollowingStore()
    const {user} = useCurrentUser()

    const {data: followingData} = useInfiniteQuery({
        queryKey: ['following'],
        queryFn: async ({pageParam = 0}) => {
            return await getMeFollowing(pageParam)
        },
        getNextPageParam: (lastPage: Omit<RestApiResponse<FollowCardProps[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0
    })

    const {data: FollowerData} = useInfiniteQuery({
        queryKey: ['followers'],
        queryFn: ({pageParam = 0}) => getMeFollowers(pageParam),
        getNextPageParam: (lastPage: Omit<RestApiResponse<FollowCardProps[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0
    })

    useEffect(() => {
        const flattenFollowingData = followingData?.pages.flatMap((page) => page.data) ?? []
        const flattenFollowerData = FollowerData?.pages.flatMap((page) => page.data) ?? []

        setInitialFollowing(flattenFollowingData)
        setInitialFollowers(flattenFollowerData)

        setFollowing(flattenFollowingData)
        setFollowers(flattenFollowerData)
    }, [FollowerData, followingData, setFollowers, setFollowing, setInitialFollowers, setInitialFollowing])

    return (
        <section className={'p-6 h-full'}>
            <Tabs defaultValue={'following'}>
                <FollowingHeader/>
                <ChannelProvider channelName={`followers.${user?.id}`}>
                    <MainFollowingTabs/>
                </ChannelProvider>
            </Tabs>
        </section>
    )
}

export default FollowingContainer