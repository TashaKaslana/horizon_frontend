import {PostListContainer} from "@/app/(home)/users/[userId]/posts/PostListContainer";

const Page = async ({params} : {params: Promise<{ userId: string }>}) => {
    const {userId} = await params

    return (
        <>
            <PostListContainer userId={userId}/>
        </>
    )
}

export default Page