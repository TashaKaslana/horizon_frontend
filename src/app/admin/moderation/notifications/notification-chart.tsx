"use client"

import * as React from "react"

import {
    ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {ChartCard} from "@/app/admin/components/chart-card";
import {useAdminNotification} from "@/app/admin/moderation/notifications/hooks/useAdminNotification";
import useAdminNotificationStore from "@/app/admin/moderation/notifications/stores/useAdminNotificationStore";
import {normalizeChartData} from "@/lib/utils";

const chartConfig = {
    count: {
        label: "Notifications",
        color: "var(--chart-2)",
    }
} satisfies ChartConfig

export function NotificationChart() {
    const [timeRange, setTimeRange] = React.useState("90")
    const {chartData} = useAdminNotificationStore()
    const {isChartLoading} = useAdminNotification(parseInt(timeRange))

    return (
        <>
            <div className="flex justify-end px-6 pb-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[160px] rounded-lg">
                        <SelectValue placeholder="Last 30 days"/>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90">Last 3 months</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="7">Last 7 days</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ChartCard
                data={normalizeChartData(chartData!)}
                isLoading={isChartLoading}
                title="Admin Notifications Statistic"
                description={`Showing new admin notifications per day for the last ${parseInt(timeRange)} days`}
                chartConfig={chartConfig}
                tooltipClassName={'w-24'}
            />
        </>
    )
}
