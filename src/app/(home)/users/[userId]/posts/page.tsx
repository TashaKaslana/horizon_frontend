import {PostListContainer} from "@/app/(home)/users/[userId]/posts/PostListContainer";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = async ({params} : {params: Promise<{ userId: string }>}) => {
    const {userId} = await params

    return (
        <>
            <PostListContainer userId={userId}/>
        </>
    )
}

export default Page