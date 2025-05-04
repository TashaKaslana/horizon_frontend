import ManagementContainer from "@/app/(home)/management/ManagementContainer";
import { Post } from "@/types/Post";

const Page = () => {
    const fakePosts: Post[] = [];


    return (
        <>
            <ManagementContainer posts={fakePosts}/>
        </>
    )
}

export default Page