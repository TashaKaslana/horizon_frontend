import UserPostContainer from "./UserPostContainer"
import {QueryClient} from "@tanstack/react-query";
import {getFeedById, getFeedByUserId} from "@/api/postApi";
import {PaginationInfo, RestApiResponse} from "@/types/api";
import {Feed} from "@/types/Feed";

const Page = async ({params}: { params: Promise<{ userId: string, postId: string }> }) => {
    const {userId, postId} = await params

    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['user-posts', {postId: postId}],
        queryFn: () => postId ? getFeedById(postId) : undefined,
    })

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['user-posts', {userId: userId}],
        queryFn: async ({pageParam = 0}) => {
            return await getFeedByUserId(userId, postId, 5, pageParam)
        },
        getNextPageParam: (lastPage: Omit<RestApiResponse<Feed[]>, 'error' | 'success'>) => {
            const pagination: PaginationInfo | undefined = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0
    })

    return (
        <>
            <UserPostContainer userId={userId} postId={postId}/>
        </>
    )
}

export default Page