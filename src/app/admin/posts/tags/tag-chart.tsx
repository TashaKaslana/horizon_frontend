"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useTagStore from "./store/useTagStore"
import {useTagManagement} from "./hooks/useTagManagement"
import {ChartCard} from "@/app/admin/components/chart-card"
import {generateChartConfig, transformTopTagData} from "@/app/admin/posts/tags/transform-gen-tag";
export function TagChart() {
    const [timeRange, setTimeRange] = React.useState("30d")
    const {dailyUsageCount} = useTagStore()
    const {isDailyUsageCountLoading} = useTagManagement(getDaysFromTimeRange(timeRange))

    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value)
    }

    return (
        <>
            <div className="flex justify-end px-6 pb-2">
                <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                    <SelectTrigger className="w-[160px] rounded-lg">
                        <SelectValue placeholder="Last 30 days" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d">Last 3 months</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ChartCard
                data={transformTopTagData(dailyUsageCount)}
                isLoading={isDailyUsageCountLoading}
                title="Tag Usage Trends"
                description={`Showing new tags created in the last ${getDaysFromTimeRange(timeRange)} days`}
                chartConfig={generateChartConfig(dailyUsageCount)}
            />
        </>
    )
}

function getDaysFromTimeRange(timeRange: string): number {
    switch (timeRange) {
        case "90d":
            return 90
        case "30d":
            return 30
        case "7d":
            return 7
        default:
            return 30
    }
}
