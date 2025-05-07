import NotificationContainer from "./NotificationContainer"
import type {Metadata} from "next";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getMyAllNotifications} from "@/api/notificationApi";
import {RestApiResponse} from "@/types/api";
import {Notification} from "@/types/Notification";

export const metadata: Metadata = {
    title: "Notifications",
    description: "View and manage your notifications",
}

const Page = async () => {
    const queryClient = new QueryClient()

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['my-notifications', {type: 'all'}],
        queryFn: async () => {
            return await getMyAllNotifications({page: 0, size: 10})
        },
        getNextPageParam: (lastPage: Omit<RestApiResponse<Notification[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotificationContainer/>
        </HydrationBoundary>
    )
}

export default Page