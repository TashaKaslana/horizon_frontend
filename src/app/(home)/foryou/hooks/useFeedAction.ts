import {useInfiniteQuery, useMutation} from '@tanstack/react-query';
import {
    LikeAction,
    RemoveLikeAction,
    bookmarkPost,
    getFeeds,
    removeBookmarkPost, reportPost
} from '@/app/(home)/foryou/api/postApi';
import {useFeedStore} from '@/app/(home)/foryou/store/useFeedStore';
import {UUID} from 'node:crypto';
import {PaginationInfo} from "@/types/api";
import {useEffect} from "react";
import {toast} from "sonner";

export const useFeedActions = () => {
    const {
        feeds,
        setFeeds,
        addFeed,
        updateFeed,
        removeFeed,
        clearFeeds,
    } = useFeedStore();

    const {
        data,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['foryou-posts'],
        queryFn: async ({pageParam = 0}) => {
            return await getFeeds({page: pageParam, size: 2});
        },
        getNextPageParam: (lastPage) => {
            const pagination: PaginationInfo | undefined = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0,
    });

    useEffect(() => {
        setFeeds(data?.pages.flatMap((page) => page.data) ?? []);
    }, [data, setFeeds]);

    const likeMutation = useMutation({
        mutationFn: ({postId, isLiked}: { postId: UUID; isLiked: boolean }) =>
            isLiked ? RemoveLikeAction(postId) : LikeAction(postId),
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
        mutationFn: ({postId, isBookmarked}: { postId: UUID, isBookmarked: boolean }) =>
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
        },
    });

    const reportMutation = useMutation({
        mutationFn: ({postId, reason}: { postId: UUID, reason: string }) => reportPost(postId, reason),
        onSuccess: () => {
            toast.success("Reported post");
        },
        onError: () => {
            toast.error("Failed to report post");
        }
    })

    const handleLike = (postId: UUID) => {
        const feed = feeds.find(f => f.post.id === postId);
        if (!feed) return;
        likeMutation.mutate({postId, isLiked: feed.statistic.isLiked});
    }

    const handleBookmark = (postId: UUID) => {
        const feed = feeds.find(f => f.post.id === postId);
        if (!feed) return;
        bookmarkMutation.mutate({postId, isBookmarked: feed.statistic.isBookmarked});
    }

    const handleShareLink = (postId: UUID) => {
        const shareUrl = `${window.location.origin}${window.location.pathname}/${postId}`;

        navigator.clipboard.writeText(shareUrl)
            .then(() => toast.success("Link copied to clipboard"))
            .catch((err) => console.error("Error copying link: ", err));
    };

    const handleReport = (postId: UUID, reason: string) => {
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
