import {OverviewCard} from "@/app/admin/components/card-overview";

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
    return (
        <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-4 gap-4
        px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5
        *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            {commentReportCards.map((card, index) => (
                <OverviewCard key={index} data={card} />
            ))}
        </div>
    );
};
