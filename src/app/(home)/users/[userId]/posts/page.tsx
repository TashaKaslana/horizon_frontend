import {PostListContainer} from "@/app/(home)/users/[userId]/posts/PostListContainer";

const Page = ({params} : {params: { userId: string }}) => {
    const userId = params.userId

    return (
        <>
            <PostListContainer userId={userId}/>
        </>
    )
}

export default Page