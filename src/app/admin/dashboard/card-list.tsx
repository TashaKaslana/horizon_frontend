import {OverviewCard} from "@/app/admin/components/card-overview";

const dashboardCards = [
    {
        title: "Total Revenue",
        value: "$1,250.00",
        trend: 12.5,
        message: "Trending up this month",
        description: "Visitors for the last 6 months"
    },
    {
        title: "New Customers",
        value: "1,234",
        trend: -20,
        message: "Down 20% this period",
        description: "Acquisition needs attention"
    },
    {
        title: "Active Accounts",
        value: "45,678",
        trend: 12.5,
        message: "Strong user retention",
        description: "Engagement exceed targets"
    },
    {
        title: "Growth Rate",
        value: "4.5%",
        trend: 4.5,
        message: "Steady performance",
        description: "Meets growth projections"
    }
]

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
