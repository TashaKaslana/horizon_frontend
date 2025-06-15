import NotificationContainer from "./NotificationContainer"
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Notifications",
    description: "View and manage your notifications",
    icons: "/images/share/Logo.tsx",
}

const Page = async () => {
    return (
        <NotificationContainer/>
    )
}

export default Page