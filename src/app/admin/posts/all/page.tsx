import PostAdminContainer from "@/app/admin/posts/all/post-admin-container";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {
    return (
        <>
            <PostAdminContainer/>
        </>
    )
}

export default Page