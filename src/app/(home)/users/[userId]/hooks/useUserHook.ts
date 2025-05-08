import {useQuery} from "@tanstack/react-query";
import {getUserOverviewById} from "@/api/userApi";

export const useUserHook = (userId: string) => {
    const {data: userData} = useQuery({
        queryKey: ['user-overview'],
        queryFn: () => getUserOverviewById(userId),
        enabled: !!userId,
    })

    const user = userData?.data

    return {
        user
    }
}