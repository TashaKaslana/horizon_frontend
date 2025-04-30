'use client';

import React, {Suspense, useState, useRef, useEffect} from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Feed } from "@/types/Feed";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import VideoContainer from "@/app/(home)/foryou/video-section/VideoContainer";
import CommentContainer from "@/app/(home)/foryou/comment-section/CommentContainer";
import { cn } from "@/lib/utils";
import {Loader2} from "lucide-react";
import { useIsVisible } from "@/hooks/use-is-visible";
import {useConfigStore} from "@/stores/useConfigStore";
import {useFeedActions} from "@/app/(home)/foryou/hooks/useFeedAction";

const ForyouContainer = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const {
        feeds,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useFeedActions()

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
    const videoRef = useRef<HTMLVideoElement>(null);
    const { ref: containerRef, isVisible } = useIsVisible<HTMLDivElement>();
    const {videoSettings} = useConfigStore()

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        if (isVisible) {
            const enableAutoPlay = videoSettings.find(v => v.key === 'auto_play')?.value

            if (video.paused && enableAutoPlay) {
                video.muted = true;
                video.play().catch((err) => {
                    console.warn('Play error:', err.message);
                });
            }
            video.muted = false;
        } else {
            if (!video.paused) {
                video.pause();
                video.muted = true;
            }
        }
    }, [isVisible, videoSettings]);

    return (
        <div className="snap-start relative h-screen w-full flex items-center justify-center">
            <div
                className={cn(
                    !isCommentOpened && "absolute inset-0",
                    "w-full h-full flex items-center justify-center gap-20"
                )}
                ref={containerRef}
            >
                <VideoContainer setIsCommentOpened={setIsCommentOpened} feed={feed} ref={videoRef}/>
                <div
                    className={cn(
                        "transition-all duration-700 ease-in-out overflow-hidden",
                        isCommentOpened ? "w-[40%] opacity-100" : "w-0 opacity-0"
                    )}
                >
                    <CommentContainer postId={feed.post.id} isCommentOpened={isCommentOpened} isVisible={isVisible}/>
                </div>
            </div>
        </div>
    );
};

export default ForyouContainer;
