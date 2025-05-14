import UserPostContainer from "./UserPostContainer"

const Page = async ({params}: { params: Promise<{ userId: string, postId: string }> }) => {
    const {userId, postId} = await params

    return (
        <>
            <UserPostContainer userId={userId} postId={postId}/>
        </>
    )
}

export default Page