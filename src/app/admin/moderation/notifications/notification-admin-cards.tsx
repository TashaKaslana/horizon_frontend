import {OverviewCard} from "@/app/admin/components/card-overview";

const notificationCards = [
    {
        title: "Total Sent",
        value: "812,430",
        trend: 5.4,
        message: "Steady traffic",
        description: "All-time total notifications sent"
    },
    {
        title: "Delivered",
        value: "789,120",
        trend: 4.9,
        message: "High delivery rate",
        description: "Successfully delivered notifications"
    },
    {
        title: "Failed",
        value: "12,340",
        trend: -3.1,
        message: "Failures decreasing",
        description: "Undelivered due to errors"
    },
    {
        title: "Unread",
        value: "63,217",
        trend: 2.6,
        message: "Pending user actions",
        description: "Notifications not yet seen"
    }
];

export const NotificationAdminCards = () => {
    return (
        <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-4 gap-4
        px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5
        *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            {notificationCards.map((card, index) => (
                <OverviewCard key={index} data={card}/>
            ))}
        </div>
    )
}