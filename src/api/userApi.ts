import {apiRequest} from "@/lib/apiRequest";
import {User, UserIntroduction, UserSummary} from "@/types/user";
import {getAccessToken} from "@auth0/nextjs-auth0";
import {toast} from "sonner";

export const getMe = async () => {
    const token = await getAccessToken()

    return await apiRequest<User>({
        url: "/users/me",
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).catch(
        (error) => {
            console.error("Error fetching user data:", error);
            toast.error("Error fetching user data")
        }
    )
}

export const getUserOverviewById = async (userId: string) => {
    const token = await getAccessToken()

    return await apiRequest<UserSummary>({
        url: `/users/${userId}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getUserIntroduction = async (userId: string) => {
    const token = await getAccessToken()

    return await apiRequest<UserIntroduction>({
        url: `/users/${userId}/intro`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateUserImage = async (
    data: Partial<{ profileImage: string; coverImage: string }>
) => {
    const token = await getAccessToken();
    return await apiRequest({
        url: `/users/me/update-image`,
        method: 'PUT',
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const createUser = async (user: {
    auth0Id: string;
    email: string;
    username: string
}) => {
    const token = await getAccessToken();

    return await apiRequest({
        url: `/users`,
        method: "POST",
        data: user,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).catch((error) => {
        console.error("Error creating user:", error);
        toast.error("Error creating user");
        throw error;
    });
};
