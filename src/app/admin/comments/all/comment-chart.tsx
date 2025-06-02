import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useCommentsStore from "./stores/useCommentsStore"
import useCommentsManagement from "./hooks/useCommentsManagement"
import {MessageSquare} from "lucide-react"
import {ChartConfig} from "@/components/ui/chart"
import {ChartCard} from "@/app/admin/components/chart-card";
import {normalizeChartData} from "@/lib/utils";

const commentChartConfig = {
    count: {
        label: "New Comments",
        icon: MessageSquare,
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function CommentChart() {
    const [timeRange, setTimeRange] = React.useState("30d")
    const {chartData} = useCommentsStore()
    const {isDailyCommentLoading} = useCommentsManagement(undefined, castTime(timeRange))

    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value)
    }

    return (
        <>
            <div className="flex justify-end px-6 pb-2">
                <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                    <SelectTrigger className="w-[160px] rounded-lg">
                        <SelectValue placeholder="Last 30 days"/>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d">Last 3 months</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ChartCard
                data={normalizeChartData(chartData!)}
                isLoading={isDailyCommentLoading}
                title="Comment Statistic"
                description={`Showing new comments per day for the last ${castTime(timeRange)} days`}
                chartConfig={commentChartConfig}
            />
        </>
    )
}

const castTime = (range: string) => {
    switch (range) {
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
