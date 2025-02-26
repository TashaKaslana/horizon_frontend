import ActionButtonGroup from "@/app/home/foryou/(video-section)/ActionButtonGroup";
import React from "react";


interface VideoContainerProps {
    setIsCommentOpened?: React.Dispatch<React.SetStateAction<boolean>>
}

const VideoContainer = ({setIsCommentOpened}: VideoContainerProps) => {
    return (
        <div className={'flex gap-4 items-center relative'}>
            <VideoSection/>
            <ActionButtonGroup setIsCommentOpened={setIsCommentOpened}/>
        </div>
    )
}

const VideoSection = () => {
    return (
        <div className={'h-[22rem] rounded-xl transition aspect-video'}>
            <video
                autoPlay
                loop
                className={'object-cover w-full h-full rounded-xl'}
                src={'https://www.w3schools.com/tags/mov_bbb.mp4'}
                controls
            />
        </div>
    )
}

export default VideoContainer