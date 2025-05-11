'use client'

import {FeedListUI} from "@/app/components/post-presentation/FeedListUI"
import React, {useEffect, useRef, useState} from "react";
import {getFeedById, getFeedByUserId} from "@/api/postApi";
import {PaginationInfo, RestApiResponse} from "@/types/api";
import {Feed} from "@/types/Feed";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";

interface UserPostContainerProps {
    userId: string,
    postId: string
}

const UserPostContainer = ({userId, postId}: UserPostContainerProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [feeds, setFeeds] = useState<Feed[]>([]);

    const {data: singleData} = useQuery({
        queryKey: ['user-posts', {postId: postId}],
        queryFn: () => postId ? getFeedById(postId) : undefined,
    })

    const {
        data: arrayData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
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

    useEffect(() => {
        if (!arrayData) return;
        const finalData = arrayData?.pages.flatMap((page) => page.data) ?? [];

        if (postId) {
            if (!singleData?.data) return;

            const singlePost = singleData.data;
            const finalFeeds = finalData.filter((f): f is Feed => !!f.post && f.post.id !== postId);

            const newData: Feed[] = [singlePost, ...finalFeeds];
            setFeeds(newData);
        } else {
            setFeeds((prev) => {
                // Check if the first post in the previous feeds is the same as the first post in the new data
                if (prev.length > 0 && prev[0].post.id !== finalData[0]?.post?.id) {
                    return prev;
                }

                return finalData;
            });
        }
    }, [arrayData, postId, setFeeds, singleData?.data]);
    
    return (
        <FeedListUI
            feeds={feeds}
            isLoading={isFetchingNextPage}
            hasMore={hasNextPage ?? false}
            loadMore={fetchNextPage}
            scrollContainerRef={scrollContainerRef}
        />
    )
}

export default UserPostContainer