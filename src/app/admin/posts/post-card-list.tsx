import {OverviewCard} from "@/app/admin/components/card-overview";

const postsPageCards = [
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


export const PostCardList = () => {
    return (
        <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-4 gap-4
        px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5
        *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            {postsPageCards.map((card, index) => (
                <OverviewCard key={index} data={card}/>
            ))}
        </div>
    )
}