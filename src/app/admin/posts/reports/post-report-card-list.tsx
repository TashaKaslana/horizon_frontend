import { OverviewList } from "@/app/admin/components/overview-list";
import { useState } from "react";

const postReportCards = [
    {
        title: "Total Posts",
        value: "87,932",
        trend: 4.1,
        message: "Steady content growth",
        description: "Total posts uploaded to date"
    },
    {
        title: "Posts Today",
        value: "1,248",
        trend: 2.7,
        message: "Slight increase from yesterday",
        description: "Posts created in the last 24 hours"
    },
    {
        title: "Reported Posts",
        value: "198",
        trend: -8.4,
        message: "Fewer reports than last week",
        description: "Posts currently flagged by users"
    },
    {
        title: "Avg. Engagement",
        value: "13.4",
        trend: 5.9,
        message: "Up from last week",
        description: "Avg likes/comments per post (7d)"
    }
];

export const PostReportCardList = () => {
    const [isLoading] = useState(false);
    return <OverviewList overviewData={postReportCards} isLoading={isLoading} />;
};
