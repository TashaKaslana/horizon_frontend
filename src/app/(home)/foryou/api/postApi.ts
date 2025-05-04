import {getAccessToken} from "@auth0/nextjs-auth0";
import {apiRequest} from "@/lib/apiRequest";
import {toast} from "sonner";
import {Feed} from "@/types/Feed";

export const LikeAction = async (postId: string) => {
    try {
        const token = await getAccessToken()

        await apiRequest({
            url: `/posts/${postId}/interactions`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                interactionType: 'LIKE'
            }
        })
    } catch (error) {
        console.error(error)
        toast.error('Error liking the post', {
            description: 'Please try again later.',
            duration: 3000,
        });
    }
}

export const RemoveLikeAction = async (postId: string) => {
    const token = await getAccessToken()

    await apiRequest({
        url: `/posts/${postId}/interactions/LIKE`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
}

export const BookmarkAction = async (postId: string) => {
    const token = await getAccessToken()

    await apiRequest({
        url: `/posts/${postId}/bookmarks`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    toast.success('Bookmark added to your book mark!', {
        description: 'You have successfully bookmarked this post.',
        duration: 3000,
    });
}

export const checkLikeStatus = async (postId: string) => {
    const token = await getAccessToken()

    const res = await apiRequest<boolean>({
        url: `/posts/${postId}/interactions/LIKE/me-is-interacted`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data;
}

export const getFeeds = async ({page = 0, size = 10, excludePostId}: {
    page?: number,
    size?: number,
    excludePostId?: string
}) => {
    const token = await getAccessToken();

    return await apiRequest<Feed[]>({
        url: '/feeds',
        method: 'GET',
        params: {
            page,
            size,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            excludePostId: excludePostId ? excludePostId : undefined
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getFeedById = async (postId: string) => {
    const token = await getAccessToken()

    return await apiRequest<Feed>({
        url: `feeds/posts/${postId}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const bookmarkPost = async (postId: string) => {
    const token = await getAccessToken()

    return await apiRequest({
        url: `/posts/${postId}/bookmarks`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const removeBookmarkPost = async (postId: string) => {
    const token = await getAccessToken()

    return await apiRequest({
        url: `/posts/${postId}/bookmarks`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const reportPost = async (postId: string, reason: string) => {
    const token = await getAccessToken()

    return await apiRequest({
        url: `/posts/${postId}/report`,
        method: 'POST',
        data: {
            reason,
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}