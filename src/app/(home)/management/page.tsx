import ManagementContainer from "@/app/(home)/management/ManagementContainer";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = async () => {

    return (
        <>
            <ManagementContainer/>
        </>
    )
}

export default Page