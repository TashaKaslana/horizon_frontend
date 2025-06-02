import {OverviewList} from "@/app/admin/components/overview-list";
import useAdminNotificationsStore from "@/app/admin/moderation/notifications/stores/useAdminNotificationStore";
import {useAdminNotification} from "@/app/admin/moderation/notifications/hooks/useAdminNotification";

export const NotificationAdminCards = () => {
    const {overviewData} = useAdminNotificationsStore()
    const {isLoading} = useAdminNotification()
    return <OverviewList overviewData={overviewData} isLoading={isLoading}/>
}

