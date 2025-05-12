'use client'

import {useQuery} from "@tanstack/react-query";
import {getUserIntroduction} from "@/api/userApi";
import {getFollowOverview} from "@/api/followApi";
import {getCountAllPosts, getCountViewAllPosts} from "@/api/postApi";

export const useUserHook = (userId: string) => {
    const {data: userData} = useQuery({
        queryKey: ['user-intro'],
        queryFn: () => getUserIntroduction(userId),
        enabled: !!userId,
    })

    const {data: followOverviewData} = useQuery({
        queryKey: ['user-follow-overview', userId],
        queryFn: () => getFollowOverview(userId),
    })


    const {data: totalAllPostCountData} = useQuery({
        queryKey: ['total-count-all-post', userId],
        queryFn: () => getCountAllPosts(userId),
    })

    const {data: totalAllPostViewCountData} = useQuery({
        queryKey: ['total-count-all-post-view', userId],
        queryFn: () => getCountViewAllPosts(userId),
    })

    const user = userData?.data
    const followOverview = followOverviewData?.data
    const totalAllPostCount = totalAllPostCountData?.data
    const totalAllPostViewCount = totalAllPostViewCountData?.data

    return {
        user,
        followOverview,
        totalAllPostCount,
        totalAllPostViewCount
    }
}