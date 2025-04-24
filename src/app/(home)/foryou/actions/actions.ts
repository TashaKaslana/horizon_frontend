import {UUID} from "node:crypto";
import {getAccessToken} from "@auth0/nextjs-auth0";
import {apiRequest} from "@/lib/apiRequest";
import {toast} from "sonner";
import {Feed} from "@/types/Feed";

export const LikeAction = async (postId: UUID) => {
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
    }
    catch (error) {
        console.error(error)
        toast.error('Error liking the post', {
            description: 'Please try again later.',
            duration: 3000,
        });
    }
}

export const RemoveLikeAction = async (postId: UUID) => {
    const token = await getAccessToken()

    await apiRequest({
        url: `/posts/${postId}/interactions/LIKE`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
}

export const BookmarkAction = () => {
    toast.success('Bookmark added to your book mark!', {
        description: 'You have successfully bookmarked this post.',
        duration: 3000,
    });
}

export const checkLikeStatus = async (postId: UUID) => {
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

export const getPosts = async ({ page = 0, size = 10 }) => {
    const token = await getAccessToken();

    return await apiRequest<Feed[]>({
        url: '/feeds',
        method: 'GET',
        params: {
            page,
            size,
            sortBy: 'createdAt',
            sortOrder: 'desc',
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
