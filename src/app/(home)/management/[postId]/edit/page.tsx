import PostEditContainer from "@/app/(home)/management/[postId]/edit/PostEditContainer";
import { QueryClient } from "@tanstack/react-query";
import {getPostById} from "@/api/postApi";

const Page = async ({ params }: { params: Promise<{ postId: string }> }) => {
    const {postId} = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['posts', postId],
        queryFn: async () => {
            return await getPostById(postId);
        },
    })

    return (
        <PostEditContainer postId={postId}/>
    );
}
export default Page;