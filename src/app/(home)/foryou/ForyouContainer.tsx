'use client';

import React, {Suspense, useMemo, useState, useRef} from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "@/app/(home)/foryou/actions/actions";
import { Feed } from "@/types/Feed";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import VideoContainer from "@/app/(home)/foryou/video-section/VideoContainer";
import CommentContainer from "@/app/(home)/foryou/comment-section/CommentContainer";
import { cn } from "@/lib/utils";
import { PaginationInfo } from "@/types/api";
import {Loader2} from "lucide-react";

const ForyouContainer = () => {
    const {
        data,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['foryou-posts'],
        queryFn: async ({ pageParam = 0 }) => {
            return await getPosts({ page: pageParam, size: 2 });
        },
        getNextPageParam: (lastPage) => {
            const pagination: PaginationInfo | undefined = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0,
    });

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // const [isReady, setIsReady] = useState(false);
    //
    // useEffect(() => {
    //     // Wait until scrollContainerRef is assigned
    //     if (scrollContainerRef.current) {
    //         setIsReady(true);
    //     }
    // }, [scrollContainerRef]);


    const feeds = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) ?? [];
    }, [data]);

    return (
        <Suspense fallback={<Skeleton />}>
            <div ref={scrollContainerRef}
                className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative">
                <InfiniteScroll
                    isLoading={isFetchingNextPage}
                    hasMore={hasNextPage ?? false}
                    next={fetchNextPage}
                    threshold={0.5}
                    root={scrollContainerRef.current}
                >
                    {feeds.map((feed, index) => (
                        <PostDisplay key={index} feed={feed} />
                    ))}
                    <Loader2
                        className={cn('my-24 h-16 w-16 text-primary/60 animate-spin absolute right-1/2')}
                    />
                </InfiniteScroll>
            </div>
        </Suspense>
    );
};

const PostDisplay = ({ feed }: { feed: Feed }) => {
    const [isCommentOpened, setIsCommentOpened] = useState(false);

    return (
        <div className="snap-start relative h-screen w-full flex items-center justify-center">
            <div
                className={cn(
                    !isCommentOpened && "absolute inset-0",
                    "w-full h-full flex items-center justify-center gap-20"
                )}
            >
                <VideoContainer setIsCommentOpened={setIsCommentOpened} feed={feed} />
                <div
                    className={cn(
                        "transition-all duration-700 ease-in-out overflow-hidden",
                        isCommentOpened ? "w-[40%] opacity-100" : "w-0 opacity-0"
                    )}
                >
                    <CommentContainer />
                </div>
            </div>
        </div>
    );
};

export default ForyouContainer;
