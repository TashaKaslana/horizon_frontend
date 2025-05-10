import {useQuery} from "@tanstack/react-query";
import {getUserIntroduction} from "@/api/userApi";
import {getFollowOverview} from "@/api/followApi";

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

    const user = userData?.data

    const followOverview = followOverviewData?.data

    return {
        user,
        followOverview
    }
}