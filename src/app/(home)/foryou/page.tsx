import ForyouContainer from "./ForyouContainer";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getFeeds} from "@/api/postApi";
import {RestApiResponse} from "@/types/api";
import {Feed} from "@/types/Feed";

const Page = async () => {
    const queryClient = new QueryClient()

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['foryou-posts'],
        queryFn: ({ pageParam = 0 }) => getFeeds({ page: pageParam, size: 2 }),
        getNextPageParam: (lastPage: Omit<RestApiResponse<Feed[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ForyouContainer/>
        </HydrationBoundary>
    )
}

export default Page;