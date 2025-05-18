import {OverviewCard} from "@/app/admin/components/card-overview";

const usersPageCards = [
    {
        title: "Total Users",
        value: "12,450",
        trend: 6.8,
        message: "Up 6.8% from last month",
        description: "Total registered users"
    },
    {
        title: "New Users (30d)",
        value: "1,234",
        trend: 2.3,
        message: "Steady onboarding rate",
        description: "Users signed up in the last 30 days"
    },
    {
        title: "Banned Users",
        value: "87",
        trend: -5.0,
        message: "Decrease in bans",
        description: "Currently banned accounts"
    },
    {
        title: "Verified Users",
        value: "652",
        trend: 12.1,
        message: "Verification requests rising",
        description: "Verified accounts to date"
    }
];


export const UserCardList = () => {
    return (
        <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-4 gap-4
        px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5
        *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            {usersPageCards.map((card, index) => (
                <OverviewCard key={index} data={card}/>
            ))}
        </div>
    )
}
