'use client'

import { PostListMain } from "./PostListMain";

export const PostListContainer = ({userId} : {userId: string}) => {
    return (
        <div className="h-full">
            <PostListMain userId={userId}/>
        </div>
    )
}