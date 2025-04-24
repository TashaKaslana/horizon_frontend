import ActionButtonGroup from "@/app/(home)/foryou/video-section/ActionButtonGroup";
import React, {Suspense} from "react";
import {useConfigStore} from "@/store/useConfigStore";
import {Feed} from "@/types/Feed";

interface VideoContainerProps {
    setIsCommentOpened?: React.Dispatch<React.SetStateAction<boolean>>,
    feed: Feed
}


const VideoContainer = ({setIsCommentOpened, feed}: VideoContainerProps) => {
    return (
        <div className={'flex gap-4 items-center relative'}>
            <Suspense fallback={<div>Loading...</div>}>
                <VideoSection videoUrl={feed.post.videoPlaybackUrl}
                              thumbnailUrl={feed.post.videoThumbnailUrl}/>
                <ActionButtonGroup setIsCommentOpened={setIsCommentOpened}
                                   postId={feed.post.id}
                                   statistic={feed.statistic}/>
            </Suspense>
        </div>
    )
}


const VideoSection = ({videoUrl, thumbnailUrl}: { videoUrl: string | null, thumbnailUrl: string | null }) => {
    const {videoSettings} = useConfigStore()

    const getValueByKey = (key: string) => {
        const value = videoSettings.find((v) => v.key === key)?.value;

        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') return value;

        return true;
    };

    return (
        <div className={'h-[22rem] rounded-xl transition aspect-video'}>
            <video
                autoPlay={getValueByKey('auto_play') === true}
                loop={getValueByKey('loop_video') === true}
                controls={getValueByKey('control_video') === true}
                className={'object-cover w-full h-full rounded-xl'}
                src={videoUrl ?? 'https://www.w3schools.com/tags/mov_bbb.mp4'}
                poster={thumbnailUrl ?? undefined}
            />
        </div>
    )
}

export default VideoContainer