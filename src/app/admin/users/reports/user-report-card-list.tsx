import {OverviewList} from "@/app/admin/components/overview-list";
import {useState} from "react";

const userReportCards = [
    {
        title: "Total Users",
        value: "12,450",
        trend: 6.5,
        message: "User base growing steadily",
        description: "All registered users"
    },
    {
        title: "New Users Today",
        value: "143",
        trend: 3.2,
        message: "Slight uptick in signups",
        description: "Users joined in the last 24 hours"
    },
    {
        title: "Reported Users",
        value: "32",
        trend: -10.1,
        message: "Fewer reports than usual",
        description: "Users flagged for violating policies"
    },
    {
        title: "Banned Users",
        value: "12",
        trend: 1.8,
        message: "Stable enforcement activity",
        description: "Users banned for policy violations"
    }
];

export const UserReportCardList = () => {
    const [isLoading] = useState(false);
    return <OverviewList overviewData={userReportCards} isLoading={isLoading} />
}

