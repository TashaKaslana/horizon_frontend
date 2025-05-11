import {Feed} from "@/types/Feed";
import React, {useEffect, useRef, useState} from "react";
import {useIsVisible} from "@/hooks/use-is-visible";
import {useConfigStore} from "@/stores/useConfigStore";
import {cn} from "@/lib/utils";
import VideoContainer from "@/app/components/post-presentation/video-section/VideoContainer";
import CommentContainer from "@/app/components/post-presentation/comment-section/CommentContainer";

export const PostDisplay = ({feed}: { feed: Feed }) => {
    const [isCommentOpened, setIsCommentOpened] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const {ref: containerRef, isVisible} = useIsVisible<HTMLDivElement>();
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

            const pathname = window.location.pathname
            const isInForyou = pathname.startsWith('/foryou')

            const userId = feed.post.user.id
            const postId = feed.post.id
            
            const basePath = isInForyou ? "/foryou" : `/users/${userId}/posts`
            const newUrl = `${basePath}/${postId}`
            const currentUrl = window.location.pathname

            if (currentUrl !== newUrl) {
                window.history.replaceState(null, "", newUrl)
            }
        } else {
            if (!video.paused) {
                video.pause();
                video.muted = true;
            }
        }
    }, [feed.post.id, feed.post.user.id, isVisible, videoSettings]);

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