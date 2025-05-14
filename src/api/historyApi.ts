import {getAccessToken} from "@auth0/nextjs-auth0";
import {History} from "@/types/History";
import {apiRequest} from "@/lib/apiRequest";

export const getHistoryForMe = async ({page = 0, size = 10} : {page: number, size: number}) => {
    const token = await getAccessToken()

    return await apiRequest<History[]>({
        url: '/histories/me',
        method: "GET",
        params: {
          page, size
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}