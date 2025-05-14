import {useDiscoverStore} from "@/app/(home)/discover/store/useDiscoverPostStore";
import {getFeeds, getPostCategories} from "@/api/postApi";
import {RestApiResponse} from "@/types/api";
import {PostCategory} from "@/types/Category";
import {Feed} from "@/types/Feed";
import {useInfiniteQuery} from "@tanstack/react-query";
import {usePostCategoryStore} from "@/app/(home)/discover/store/usePostCategoryStore";
import { useEffect } from "react";

export const useDiscovery = () => {
    const {feeds, setFeeds} = useDiscoverStore()
    const {categories, setCategories, selectedCategory} = usePostCategoryStore()

    const {
        data: categoryData,
        hasNextPage: categoryHasNextPage,
        isFetchingNextPage: categoryIsFetching,
        fetchNextPage: categoryFetchNext
    } = useInfiniteQuery({
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

    const {data: feedData,
        hasNextPage: feedHasNextPage,
        isFetchingNextPage: feedIsFetching,
        fetchNextPage: feedFetchNext} = useInfiniteQuery({
        queryKey: ['posts-discover', {category: selectedCategory}],
        queryFn: async ({pageParam = 0}) => {
            return await getFeeds({
                page: pageParam,
                size: 2,
                categoryName: selectedCategory.toLowerCase() !== 'all' ? selectedCategory : undefined
            })
        },
        getNextPageParam: (lastPage: Omit<RestApiResponse<Feed[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0
    })

    useEffect(() => {
        const categoriesFlatten = categoryData?.pages.flatMap((page) => page.data);
        
        if (categoriesFlatten) {
            setCategories(categoriesFlatten);
        }
    }, [categoryData?.pages, setCategories])
    
    useEffect(() => {
        const feedsFlatten = feedData?.pages.flatMap((page) => page.data);
        
        if (feedsFlatten) {
            setFeeds(feedsFlatten);
        }
    }, [feedData?.pages, setFeeds])

    return {
        categories,
        categoryHasNextPage,
        categoryIsFetching,
        categoryFetchNext,
        feeds,
        feedHasNextPage,
        feedIsFetching,
        feedFetchNext,
    }
}