"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useLoggingStore from "./useLoggingStore"
import {useLoggingManagement} from "./useLoggingManagement"
import {ChartCard} from "@/app/admin/components/chart-card"
import {ChartConfig} from "@/components/ui/chart"
import {normalizeChartData} from "@/lib/utils";

const chartConfig = {
    count: {
        label: "Error Logs",
        color: "var(--chart-5)",
    }
} satisfies ChartConfig

export function LogErrorChart() {
    const [timeRange, setTimeRange] = React.useState("30d")
    const {logChartData} = useLoggingStore()
    const {isLogChartLoading} = useLoggingManagement(undefined, getDaysFromTimeRange(timeRange))


    return (
        <>
            <div className="flex justify-end px-6 pb-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
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
                isLoading={isLogChartLoading}
                data={normalizeChartData(logChartData)}
                title="Error Logs"
                description={`Showing error and critical logs for the last ${getDaysFromTimeRange(timeRange)} days`}
                chartConfig={chartConfig}
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

