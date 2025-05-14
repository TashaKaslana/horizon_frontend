import apiClient from "@/lib/apiClient";
import {UserProfileInformationUpdate} from "@/types/user";

export const updateProfileRequest = async (token: string, profileData: UserProfileInformationUpdate) => {
    await apiClient.put(`/users/me/info`, profileData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    )
}