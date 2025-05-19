import {OverviewCard} from "@/app/admin/components/card-overview";

const moderationCards = [
    {
        title: "Pending Reports",
        value: "43",
        trend: -12.0,
        message: "Fewer reports than last week",
        description: "Reports requiring admin review"
    },
    {
        title: "Resolved Today",
        value: "15",
        trend: 5.0,
        message: "More resolutions than yesterday",
        description: "Reports actioned and resolved today"
    },
    {
        title: "Content Removed (7d)",
        value: "28",
        trend: 2.0,
        message: "Slight increase in content takedowns",
        description: "Posts/Comments removed in the last 7 days"
    },
    {
        title: "Users Actioned (7d)",
        value: "5",
        trend: -1.0,
        message: "Fewer user actions this week",
        description: "Users warned or banned in the last 7 days"
    }
];

export const ModerationCardList = () => {
    return (
        <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-4 gap-4
        px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5
        *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            {moderationCards.map((card, index) => (
                <OverviewCard key={index} data={card}/>
            ))}
        </div>
    )
}
