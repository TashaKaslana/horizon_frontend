import {OverviewCard} from "@/app/admin/components/card-overview";

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
    return (
        <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-4 gap-4
        px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5
        *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            {userReportCards.map((card, index) => (
                <OverviewCard key={index} data={card}/>
            ))}
        </div>
    )
}