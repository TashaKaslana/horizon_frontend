import FollowingContainer from "@/app/(home)/following/FollowingContainer";
import {FollowCardProps} from "@/types/follow";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getMeFollowers, getMeFollowing} from "@/api/followApi";
import {RestApiResponse} from "@/types/api";

const Page = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['following'],
        queryFn: ({pageParam = 0}) => getMeFollowing(pageParam),
        getNextPageParam: (lastPage : Omit<RestApiResponse<FollowCardProps[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0
    })

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['followers'],
        queryFn: ({pageParam = 0}) => getMeFollowers(pageParam),
        getNextPageParam: (lastPage : Omit<RestApiResponse<FollowCardProps[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <FollowingContainer/>
        </HydrationBoundary>
    )
}

export default Page;