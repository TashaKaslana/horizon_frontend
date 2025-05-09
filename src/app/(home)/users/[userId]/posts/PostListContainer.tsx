'use client'

import UserOverviewHeader from "@/app/(home)/users/[userId]/components/UserOverviewHeader";
import { PostListMain } from "./PostListMain";

export const PostListContainer = ({userId} : {userId: string}) => {
    return (
        <div className="h-full">
            <UserOverviewHeader userId={userId}/>
            <PostListMain/>
        </div>
    )
}