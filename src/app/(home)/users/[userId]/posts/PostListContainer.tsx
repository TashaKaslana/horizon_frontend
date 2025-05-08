'use client'

import UserOverviewHeader from "@/app/(home)/users/[userId]/components/UserOverviewHeader";

export const PostListContainer = ({userId} : {userId: string}) => {
    return (
        <div>
            <UserOverviewHeader userId={userId}/>
        </div>
    )
}