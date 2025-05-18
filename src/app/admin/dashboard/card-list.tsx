import {OverviewCard} from "@/app/admin/components/card-overview";

const dashboardCards = [
    {
        title: "Total Users",
        value: "12,450",
        trend: 8.2,
        message: "Up 8.2% this month",
        description: "User growth over the last 30 days"
    },
    {
        title: "Total Posts",
        value: "87,932",
        trend: 5.4,
        message: "Steady content creation",
        description: "Posts uploaded in the last 30 days"
    },
    {
        title: "Active Users",
        value: "6,723",
        trend: 10.1,
        message: "High engagement this week",
        description: "Users active in the last 7 days"
    },
    {
        title: "Pending Reports",
        value: "43",
        trend: -12.0,
        message: "Fewer reports than last week",
        description: "Reports requiring admin review"
    }
];

export const CardList = () => {
    return (
        <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-4 gap-4
        px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5
        *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            {dashboardCards.map((card, index) => (
                <OverviewCard key={index} data={card}/>
            ))}
        </div>
    )
}
