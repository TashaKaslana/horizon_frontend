'use client'

import {OverviewList} from "@/app/admin/components/overview-list";
import useCommentsStore from "./stores/useCommentsStore";
import useCommentsManagement from "./hooks/useCommentsManagement";

export const CommentCardList = () => {
    const {overviewData} = useCommentsStore()
    const {isCommentOverviewLoading} = useCommentsManagement()

    return <OverviewList overviewData={overviewData} isLoading={isCommentOverviewLoading} />
}
