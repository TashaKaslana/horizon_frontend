'use client'

import {OverviewList} from "@/app/admin/components/overview-list";
import usePostsStore from "@/app/admin/posts/all/stores/usePostsStore";
import {usePostsSync} from "@/app/admin/posts/all/hooks/usePostsSync";

export const PostCardList = () => {
    const {overviewData} = usePostsStore()
    const {isPostOverviewLoading} = usePostsSync()

    return <OverviewList overviewData={overviewData} isLoading={isPostOverviewLoading} />
}

