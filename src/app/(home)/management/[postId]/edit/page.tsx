import PostEditContainer from "@/app/(home)/management/[postId]/edit/PostEditContainer";

const Page = async ({ params }: { params: Promise<{ postId: string }> }) => {
    const {postId} = await params;

    return (
        <PostEditContainer postId={postId}/>
    );
}
export default Page;