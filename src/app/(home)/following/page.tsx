import FollowingContainer from "@/app/(home)/following/FollowingContainer";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = async () => {

    return (
        <FollowingContainer/>
    )
}

export default Page;