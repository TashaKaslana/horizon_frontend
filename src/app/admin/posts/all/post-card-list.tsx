'use client'

import {OverviewList} from "@/app/admin/components/overview-list";
import usePostsStore from "@/app/admin/posts/all/stores/usePostsStore";
import {usePostsManagement} from "@/app/admin/posts/all/hooks/usePostsManagement";

export const PostCardList = () => {
    const {overviewData} = usePostsStore()
    const {isPostOverviewLoading} = usePostsManagement()

    return <OverviewList overviewData={overviewData} isLoading={isPostOverviewLoading} />
}

