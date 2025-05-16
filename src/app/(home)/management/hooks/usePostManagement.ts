import {usePostManagementStore} from "@/app/(home)/management/store/usePostManagementStore";
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import {deletePost, getFeedByUserId} from "@/api/postApi";
import {useEffect, useRef} from "react";
import { toast } from "sonner";
import {useCurrentUser} from "@/stores/useCurrentUser";

export const usePostManagement = () => {
    const {feeds, setInitialPosts, setPosts, deletePostById} = usePostManagementStore()
    const deletedPostIdsRef = useRef<Set<string>>(new Set());
    const {user} = useCurrentUser();


    const {data, isFetchingNextPage, fetchNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['my-posts'],
        queryFn: async ({pageParam = 0}) => {
            return await getFeedByUserId({userId: user!.id, page: pageParam, size: 2})
        },
        getNextPageParam: (lastPage) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0,
        enabled: !!user?.id
    })

    const postDeleteMutation = useMutation({
        mutationFn: async (postId: string) => {
            return await deletePost(postId)
        },
        onSuccess: (_data, postId ) => {
            deletedPostIdsRef.current.add(postId)
            deletePostById(postId)
            toast.success("Post deleted successfully.")
        },
        onError: () => {
            toast.error('Failed to delete post')
        }
    })

    useEffect(() => {
        const feedsData = data?.pages.flatMap((page) => page.data) ?? [];
        if (feedsData.length === 0) return;

        const filteredFeeds = feedsData.filter((feed) => {
            return !deletedPostIdsRef.current.has(feed.post.id);
        })
        if (filteredFeeds.length === 0) return;

        setPosts(filteredFeeds);
        setInitialPosts(filteredFeeds);
    }, [data?.pages, setInitialPosts, setPosts]);

    const deletePostAction = (postId: string) => {
        postDeleteMutation.mutate(postId)
    }

    return {
        feeds,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        deletePostAction,
    }
}