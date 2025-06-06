import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {
    likePost,
    removeLikePost,
    bookmarkPost,
    getFeeds,
    removeBookmarkPost, reportPost, getFeedById
} from '@/api/postApi';
import {useFeedStore} from '@/app/(home)/foryou/store/useFeedStore';
import {PaginationInfo} from "@/types/api";
import {useEffect} from "react";
import {toast} from "sonner";
import {Feed} from "@/types/Feed";

export const useFeedActions = (excludePostId?: string) => {
    const {
        feeds,
        setFeeds,
        addFeed,
        updateFeed,
        removeFeed,
        clearFeeds,
    } = useFeedStore();

    const {data: singleData} = useQuery({
        queryKey: ['foryou-post', excludePostId],
        queryFn: () => excludePostId ? getFeedById(excludePostId) : undefined,
        enabled: !!excludePostId,
    });

    const {
        data,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['foryou-posts', {exclude: excludePostId}],
        queryFn: async ({pageParam = 0}) => {
            return await getFeeds({page: pageParam, size: 2, excludePostId: excludePostId});
        },
        getNextPageParam: (lastPage) => {
            const pagination: PaginationInfo | undefined = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0,
    });

    useEffect(() => {
        if (!data) return;
        const finalData = data?.pages.flatMap((page) => page.data) ?? [];

        if (excludePostId) {
            if (!singleData?.data) return;

            const singlePost = singleData.data;
            const finalFeeds = finalData.filter((f): f is Feed => !!f.post && f.post.id !== excludePostId);

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
    }, [data, excludePostId, setFeeds, singleData?.data]);

    const likeMutation = useMutation({
        mutationFn: ({postId, isLiked}: { postId: string; isLiked: boolean }) =>
            isLiked ? removeLikePost(postId) : likePost(postId),
        onSuccess: (_, {postId, isLiked}) => {
            updateFeed(postId, (prev) => ({
                ...prev,
                statistic: {
                    ...prev.statistic,
                    isLiked: !isLiked,
                    totalLikes: isLiked
                        ? Math.max(0, prev.statistic.totalLikes - 1)
                        : prev.statistic.totalLikes + 1,
                },
            }));
        },
    });

    const bookmarkMutation = useMutation({
        mutationFn: ({postId, isBookmarked}: { postId: string, isBookmarked: boolean }) =>
            isBookmarked ? removeBookmarkPost(postId) : bookmarkPost(postId),
        onSuccess: (_, {postId, isBookmarked}) => {
            updateFeed(postId, (prev) => ({
                ...prev,
                statistic: {
                    ...prev.statistic,
                    isBookmarked: !isBookmarked,
                    totalBookmarks: isBookmarked
                        ? Math.max(0, prev.statistic.totalBookmarks - 1)
                        : prev.statistic.totalBookmarks + 1,
                },
            }));
            toast.success(isBookmarked ? "Removed bookmark" : "Added bookmark");
        },
    });

    const reportMutation = useMutation({
        mutationFn: ({postId, reason}: { postId: string, reason: string }) => reportPost(postId, reason),
        onSuccess: () => {
            toast.success("Reported post");
        },
        onError: () => {
            toast.error("Failed to report post");
        }
    })

    const handleLike = (postId: string) => {
        const feed = feeds.find(f => f.post.id === postId);
        if (!feed) return;
        likeMutation.mutate({postId, isLiked: feed.statistic.isLiked});
    }

    const handleBookmark = (postId: string) => {
        const feed = feeds.find(f => f.post.id === postId);
        if (!feed) return;
        bookmarkMutation.mutate({postId, isBookmarked: feed.statistic.isBookmarked});
    }

    const handleShareLink = (postId: string) => {
        const shareUrl = `${window.location.origin}${window.location.pathname}/${postId}`;

        navigator.clipboard.writeText(shareUrl)
            .then(() => toast.success("Link copied to clipboard"))
            .catch((err) => console.error("Error copying link: ", err));
    };

    const handleReport = (postId: string, reason: string) => {
        const feed = feeds.find(f => f.post.id === postId);
        if (!feed) return;

        reportMutation.mutate({postId, reason})
    }

    return {
        feeds,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        handleLike,
        handleBookmark,
        handleShareLink,
        handleReportPost: handleReport,
        addFeed,
        removeFeed,
        clearFeeds,
    };
};
