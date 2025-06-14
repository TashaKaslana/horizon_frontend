'use client';

import {useInfiniteQuery} from "@tanstack/react-query";
import {useCommentStore} from "@/app/(home)/foryou/store/useCommentStore";
import {getCommentsByPostId} from "@/api/commentApi";
import {useEffect} from "react";
import {CommentResponse} from "@/types/Comment";
import {PaginationInfo} from "@/types/api";
import {mergeById} from "@/lib/utils";

interface UseCommentsReturn {
    comments: CommentResponse[];
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isLoading: boolean;
}

export function useComments(postId: string, pageSize: number = 10): UseCommentsReturn {
    const {getComments, setComments} = useCommentStore();

    const comments = getComments(postId);

    const {
        data: infiniteData,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['foryou-comments', postId],
        queryFn: async ({pageParam = 0}) => {
            return await getCommentsByPostId(postId, {page: pageParam, size: pageSize});
        },
        getNextPageParam: lastPage => {
            const pagination: PaginationInfo | undefined = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0
    });

    useEffect(() => {
        if (infiniteData) {
            const allComments = infiniteData.pages.flatMap((page) => page.data);
            const latestTimestamp = infiniteData.pages.at(-1)?.timestamp ?? Date.now();

            setComments(
                postId,
                (existing) => mergeById(existing, allComments, { preferNewer: true }),
                latestTimestamp
            );
        }
    }, [infiniteData, postId, setComments]);

    return {
        comments,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isLoading
    };
}
