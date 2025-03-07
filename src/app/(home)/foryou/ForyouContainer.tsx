'use client'

import VideoContainer from "@/app/(home)/foryou/video-section/VideoContainer";
import CommentContainer from "@/app/(home)/foryou/comment-section/CommentContainer";
import {useState} from "react";

const ForyouContainer = () => {
    const [isCommentOpened, setIsCommentOpened] = useState(false);

    return (
        <div className="flex size-full gap-8 justify-center items-center transition-all duration-300 ease-in-out">
            <div
                className={`flex justify-center transition-all duration-500 ease-in-out ${
                    isCommentOpened ? "w-[60%]" : "w-full"
                }`}
            >
                <VideoContainer setIsCommentOpened={setIsCommentOpened} />
            </div>
            <div
                className={`transition-all duration-700 ease-in-out overflow-hidden ${
                    isCommentOpened ? "w-[40%] opacity-100" : "w-0 opacity-0"
                }`}
            >
                <CommentContainer/>
            </div>
        </div>
    )
}

export default ForyouContainer;