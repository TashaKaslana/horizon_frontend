import PostEditContainer from "@/app/(home)/management/[postId]/edit/PostEditContainer";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = async ({ params }: { params: Promise<{ postId: string }> }) => {
    const {postId} = await params;

    return (
        <PostEditContainer postId={postId}/>
    );
}
export default Page;