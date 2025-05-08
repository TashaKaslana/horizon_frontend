import {apiRequest} from "@/lib/apiRequest";
import {User, UserSummary} from "@/types/user";
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