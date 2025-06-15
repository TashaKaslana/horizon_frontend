import CommentAdminContainer from "@/app/admin/comments/all/comment-admin-container";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {
    return (
        <CommentAdminContainer/>
    );
}

export default Page;