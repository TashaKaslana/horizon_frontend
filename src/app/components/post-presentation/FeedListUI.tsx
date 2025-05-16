import { Suspense, RefObject } from "react";
import { PostDisplay } from "@/app/components/post-presentation/PostDisplay";
import {Feed} from "@/types/Feed";
import {Skeleton} from "@/components/ui/skeleton";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import {Spinner} from "@/components/ui/spinner";

interface FeedListUIProps {
    feeds: Feed[];
    isLoading: boolean;
    hasMore: boolean;
    loadMore: () => void;
    scrollContainerRef: RefObject<HTMLDivElement | null>;
}

export const FeedListUI = ({
                               feeds,
                               isLoading,
                               hasMore,
                               loadMore,
                               scrollContainerRef,
                           }: FeedListUIProps) => {
    return (
        <Suspense fallback={<Skeleton />}>
            <div
                ref={scrollContainerRef}
                className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative"
            >
                <InfiniteScroll
                    isLoading={isLoading}
                    hasMore={hasMore}
                    next={loadMore}
                    threshold={0.5}
                    root={scrollContainerRef.current}
                >
                    {feeds
                        .filter((feed) => feed?.post?.id)
                        .map((feed, index) => (
                            <PostDisplay key={index} feed={feed} />
                        ))}
                    {isLoading && (
                        <div className="flex justify-center items-center">
                            <Spinner />
                        </div>
                    )}
                </InfiniteScroll>
            </div>
        </Suspense>
    );
};
