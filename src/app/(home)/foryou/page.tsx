import ForyouContainer from "./ForyouContainer";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getPosts} from "@/app/(home)/foryou/actions/actions";
import {Suspense} from "react";

const Page = async () => {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['foryou-posts'],
        queryFn: getPosts,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<div>Loading...</div>}>
                <ForyouContainer/>
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page;