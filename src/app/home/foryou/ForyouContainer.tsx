'use client'

import VideoContainer from "@/app/home/foryou/(video-section)/VideoContainer";
import CommentContainer from "@/app/home/foryou/(comment-section)/CommentContainer";
import { useState } from "react";

const ForyouContainer = () => {
    const [isCommentOpened, setIsCommentOpened] = useState(false);

    return (
        <div className={`flex size-full gap-12 justify-center items-center transition-all duration-300 ease-in-out ${isCommentOpened ? '' : 'justify-center'}`}>
            <div className={`transition-transform duration-500 ease-in-out ${isCommentOpened ? 'transform-none' : ''}`}>
                <VideoContainer setIsCommentOpened={setIsCommentOpened} />
            </div>
            <div className={`transition-all duration-1000 ease-in-out ${isCommentOpened ? 'opacity-100' : 'opacity-0 '}`}>
                <CommentContainer isCommentOpened={isCommentOpened}/>
            </div>
        </div>
    )
}

export default ForyouContainer;