import {getAccessToken} from "@auth0/nextjs-auth0";
import {apiRequest} from "@/lib/apiRequest";
import {toast} from "sonner";
import {Feed} from "@/types/Feed";
import {Post, UpdatePost} from "@/types/Post";

export const likePost = async (postId: string) => {
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

export const removeLikePost = async (postId: string) => {
    const token = await getAccessToken()

    await apiRequest({
        url: `/posts/${postId}/interactions/LIKE`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
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


export const getPostById = async (postId: string) => {
    const token = await getAccessToken()

    return await apiRequest<Post>({
        url: `/posts/${postId}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updatePost = async (postId: string, data: UpdatePost) => {
    const token = await getAccessToken()

    return await apiRequest({
        url: `/posts/${postId}`,
        method: 'PUT',
        data,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}