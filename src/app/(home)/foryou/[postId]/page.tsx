import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import ForyouContainer from "../ForyouContainer"
import {UUID} from "node:crypto";
import {getFeeds, getFeedById} from "@/api/postApi";
import {Feed} from "@/types/Feed";
import {RestApiResponse} from "@/types/api";

const Page = async ({params}: { params: Promise<{ postId: UUID }> }) => {
    const {postId} = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['foryou-post', postId],
        queryFn: () => getFeedById(postId),
    })

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['foryou-posts', {exclude: postId}],
        queryFn: ({pageParam = 0}) => getFeeds({
            page: pageParam, size: 2, excludePostId: postId
        }),
        getNextPageParam: (lastPage: Omit<RestApiResponse<Feed[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ForyouContainer postId={postId}/>
        </HydrationBoundary>
    )
}

export default Page