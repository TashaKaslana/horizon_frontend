import NotificationContainer from "./NotificationContainer"
import {notifications} from "@/app/(home)/notifications/libs/notification-data";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Notifications",
    description: "View and manage your notifications",
}

const Page = () => {
    return (
        <>
            <NotificationContainer initialNotification={notifications}/>
        </>
    )
}

export default Page