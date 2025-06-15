import UserPostContainer from "./UserPostContainer"
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = async ({params}: { params: Promise<{ userId: string, postId: string }> }) => {
    const {userId, postId} = await params

    return (
        <>
            <UserPostContainer userId={userId} postId={postId}/>
        </>
    )
}

export default Page