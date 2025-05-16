import ForyouContainer from "../ForyouContainer"

const Page = async ({params}: { params: Promise<{ postId: string }> }) => {
    const {postId} = await params;

    return (
        <ForyouContainer postId={postId}/>
    )
}

export default Page