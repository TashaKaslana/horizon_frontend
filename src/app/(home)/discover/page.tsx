import DiscoverContainer from "@/app/(home)/discover/DiscoverContainer";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getFeeds, getPostCategories} from "@/api/postApi";
import {RestApiResponse} from "@/types/api";
import {PostCategory} from "@/types/Category";
import {Feed} from "@/types/Feed";

const Page = async () => {
    const queryClient = new QueryClient()

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['post-category'],
        queryFn: async ({pageParam = 0}) => {
            return await getPostCategories({page: pageParam, size: 10})
        },
        getNextPageParam: (lastPage: Omit<RestApiResponse<PostCategory[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0
    })

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['posts-discover', {category: 'all'}],
        queryFn: async ({pageParam = 0}) => {
            return await getFeeds({page: pageParam, size: 10})
        },
        getNextPageParam: (lastPage: Omit<RestApiResponse<Feed[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DiscoverContainer/>
        </HydrationBoundary>
    )
}

export default Page