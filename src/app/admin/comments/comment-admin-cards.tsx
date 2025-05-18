import {OverviewCard} from "@/app/admin/components/card-overview";

const commentsPageCards = [
    {
        title: "Total Comments",
        value: "235,128",
        trend: 6.3,
        message: "Healthy engagement",
        description: "All-time total comments"
    },
    {
        title: "Comments Today",
        value: "1,945",
        trend: 2.1,
        message: "Up from yesterday",
        description: "Activity in the past 24h"
    },
    {
        title: "Reported Comments",
        value: "83",
        trend: -4.2,
        message: "Moderation load easing",
        description: "Comments flagged for review"
    },
    {
        title: "Avg. Comments/Post",
        value: "7.2",
        trend: 1.8,
        message: "Steady interactions",
        description: "Engagement over the past 7 days"
    }
];

export const CommentCardList = () => {
    return (
        <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-4 gap-4
        px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5
        *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            {commentsPageCards.map((card, index) => (
                <OverviewCard key={index} data={card}/>
            ))}
        </div>
    )
}