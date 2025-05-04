import {usePostManagementStore} from "@/app/(home)/management/store/usePostManagementStore";
import {useInfiniteQuery} from "@tanstack/react-query";
import {getFeeds} from "@/api/postApi";
import {useEffect} from "react";

export const usePostManagement = () => {
    const {feeds, setInitialPosts, setPosts} = usePostManagementStore()

    const {data, isFetchingNextPage, fetchNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['my-posts'],
        queryFn: async ({pageParam = 0}) => {
            return await getFeeds({page: pageParam, size: 2})
        },
        getNextPageParam: (lastPage) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0
    })

    useEffect(() => {
        const feedsData = data?.pages.flatMap((page) => page.data) ?? [];
        if (feedsData.length === 0) return;

        setPosts(feedsData);
        setInitialPosts(feedsData);
    }, [data?.pages, setInitialPosts, setPosts]);
    
    return {
        feeds,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    }
}