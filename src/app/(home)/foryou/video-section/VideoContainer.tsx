import ActionButtonGroup from "@/app/(home)/foryou/video-section/ActionButtonGroup";
import React from "react";
import {useConfigStore} from "@/store/useConfigStore";


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
                src={'https://www.w3schools.com/tags/mov_bbb.mp4'}
            />
        </div>
    )
}

export default VideoContainer