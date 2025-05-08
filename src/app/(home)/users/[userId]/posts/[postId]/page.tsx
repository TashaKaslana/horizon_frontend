import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getFeedById} from "@/api/postApi";
import ForyouContainer from "@/app/(home)/foryou/ForyouContainer";

const Page = async ({params}: { params: Promise<{ postId: string }> }) => {
    const {postId} = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['post', postId],
        queryFn: () => getFeedById(postId),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ForyouContainer postId={postId}/>
        </HydrationBoundary>
    )
}

export default Page