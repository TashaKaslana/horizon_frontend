import {getAccessToken} from "@auth0/nextjs-auth0";
import {apiRequest} from "@/lib/apiRequest";
import {toast} from "sonner";
import {Feed} from "@/types/Feed";
import {Post, TotalPostResponse, TotalViewResponse, UpdatePost} from "@/types/Post";
import {PostCategory} from "@/types/Category";

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

export const getFeeds = async ({page = 0, size = 10, excludePostId, categoryName}: {
    page?: number,
    size?: number,
    excludePostId?: string
    categoryName?: string
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
            excludePostId: excludePostId ? excludePostId : undefined,
            categoryName: categoryName ? categoryName : undefined
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

export const getFeedByUserId = async ({userId, excludePostId, size = 5, page = 0}: {
    userId: string;
    excludePostId?: string;
    size?: number;
    page?: number;
}) => {
    const token = await getAccessToken()

    return await apiRequest<Feed[]>({
        url: `feeds/users/${userId}`,
        params: {
            excludePostId: excludePostId ? excludePostId : undefined,
            size,
            page
        },
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

export const deletePost = async (postId: string) => {
    const token = await getAccessToken()

    return await apiRequest({
        url: `/posts/${postId}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getPostCategories = async (p0: { page: number; size: number; }) => {
    const token = await getAccessToken()

    return await apiRequest<PostCategory[]>({
        url: '/post-categories',
        method: 'GET',
        params: {
            page: p0.page,
            size: p0.size
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getViewCountByPostId = async (postId: string) => {
    const token = await getAccessToken()

    return await apiRequest<PostCategory[]>({
        url: `/posts/${postId}/views`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const recordPostView = async (postId: string) => {
    const token = await getAccessToken()

    return await apiRequest<PostCategory[]>({
        url: `/posts/${postId}/view`,
        method: 'POST',
        data: {},
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getCountAllPosts = async (userId: string) => {
    const token = await getAccessToken()

    return await apiRequest<TotalPostResponse>({
        url: `/posts/users/${userId}/total-posts`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getCountViewAllPosts = async (userId: string) => {
    const token = await getAccessToken()

    return await apiRequest<TotalViewResponse>({
        url: `/posts/users/${userId}/total-views`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}