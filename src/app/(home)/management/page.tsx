import ManagementContainer from "@/app/(home)/management/ManagementContainer";
import {QueryClient} from "@tanstack/react-query";
import {getFeeds} from "@/api/postApi";
import {RestApiResponse} from "@/types/api";
import {Feed} from "@/types/Feed";

const Page = async () => {
    const query = new QueryClient()

    await query.prefetchInfiniteQuery({
        queryKey: ['my-posts'],
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
        <>
            <ManagementContainer/>
        </>
    )
}

export default Page