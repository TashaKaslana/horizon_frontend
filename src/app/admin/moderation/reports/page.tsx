import ModerationContainer from "@/app/admin/moderation/reports/moderation-container";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {
    return (
        <ModerationContainer/>
    )
}

export default Page;