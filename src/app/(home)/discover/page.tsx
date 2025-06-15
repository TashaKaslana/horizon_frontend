import DiscoverContainer from "@/app/(home)/discover/DiscoverContainer";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = async () => {
    return (
        <DiscoverContainer/>
    )
}

export default Page