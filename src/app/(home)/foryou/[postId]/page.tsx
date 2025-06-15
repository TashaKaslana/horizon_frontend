import ForyouContainer from "../ForyouContainer"
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = async ({params}: { params: Promise<{ postId: string }> }) => {
    const {postId} = await params;

    return (
        <ForyouContainer postId={postId}/>
    )
}

export default Page