import {OverviewList} from "@/app/admin/components/overview-list";
import {useState} from "react";

const commentReportCards = [
    {
        title: "Total Comments",
        value: "254,321",
        trend: 3.5,
        message: "Consistent discussion levels",
        description: "Total comments made on posts"
    },
    {
        title: "Comments Today",
        value: "3,211",
        trend: 4.6,
        message: "Slight increase in activity",
        description: "Comments made in the last 24 hours"
    },
    {
        title: "Reported Comments",
        value: "87",
        trend: -6.3,
        message: "Moderation load easing",
        description: "Comments flagged by users"
    },
    {
        title: "Avg. Replies per Comment",
        value: "1.9",
        trend: 2.1,
        message: "More engaging discussions",
        description: "Based on last 7 days"
    }
];

export const CommentReportCardList = () => {
    const [isLoading] = useState(false);
    return <OverviewList overviewData={commentReportCards} isLoading={isLoading} />;
};
