'use client'

import {OverviewList} from "@/app/admin/components/overview-list";
import {useReportStore} from "@/app/admin/moderation/reports/useReportStore";
import {useModeration} from "@/app/admin/moderation/reports/useModeration";

export const ModerationCardList = () => {
    const { overview } = useReportStore();
    const { isOverviewLoading } = useModeration();

    return <OverviewList overviewData={overview} isLoading={isOverviewLoading} />
}

export const UserModerationCardList = () => {
    const { userOverview } = useReportStore();
    const { isUserOverviewLoading } = useModeration();

    return <OverviewList overviewData={userOverview} isLoading={isUserOverviewLoading} />
}

export const PostModerationCardList = () => {
    const { postOverview } = useReportStore();
    const { isPostOverviewLoading } = useModeration();

    return <OverviewList overviewData={postOverview} isLoading={isPostOverviewLoading} />
}

export const CommentModerationCardList = () => {
    const { commentOverview } = useReportStore();
    const { isCommentOverviewLoading } = useModeration();

    return <OverviewList overviewData={commentOverview} isLoading={isCommentOverviewLoading} />
}
