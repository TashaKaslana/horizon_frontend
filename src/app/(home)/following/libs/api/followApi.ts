import {apiRequest} from "@/lib/apiRequest";
import {getAccessToken} from "@auth0/nextjs-auth0";
import {FollowCardProps} from "@/app/(home)/following/types/type";

export const getMeFollowing = async (page: number, size = 10) => {
    const token = await getAccessToken();

    return await apiRequest<FollowCardProps[]>({
        url: `/follows/me/following`,
        params: {page, size},
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getMeFollowers = async (page: number, size = 10) => {
    const token = await getAccessToken();
    return await apiRequest<FollowCardProps[]>({
        url: `/follows/me/followers`,
        method: 'GET',
        params: {page, size},
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const followUser = async (userId: string) => {
    const token = await getAccessToken();
    return await apiRequest({
        url: `/follows/${userId}`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const unfollowUser = async (userId: string) => {

    const token = await getAccessToken();
    return await apiRequest({
        url: `/follows/${userId}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
