import FollowingContainer from "@/app/(home)/following/FollowingContainer";
import {FollowCardProps} from "@/app/(home)/following/types/type";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getMeFollowers, getMeFollowing} from "@/app/(home)/following/libs/api/followApi";
import {RestApiResponse} from "@/types/api";

const Page = async () => {
    // const usersData : UserCardProps[] = [
    //     {
    //         avatarUrl: "https://i.pravatar.cc/150?img=5",
    //         displayName: "Follow",
    //         username: "AlexCoder",
    //         bio: "Building the future, one line at a time.",
    //         rank: "beginner",
    //         followingCount: 100,
    //         followersCount: 200,
    //     },
    //     {
    //         avatarUrl: "https://i.pravatar.cc/150?img=8",
    //         displayName: 'Pravatar',
    //         username: "TechGuru",
    //         bio: "Moderator | Helping devs since 2015.",
    //         rank: "moderator",
    //         followersCount: 450,
    //         followingCount: 130,
    //     },
    //     {
    //         avatarUrl: "https://i.pravatar.cc/150?img=12",
    //         displayName: "Moderator",
    //         username: "CodeMaster",
    //         bio: "Full-stack dev & AI enthusiast.",
    //         rank: "expert",
    //         followersCount: 1050,
    //         followingCount: 300,
    //     }
    // ]

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