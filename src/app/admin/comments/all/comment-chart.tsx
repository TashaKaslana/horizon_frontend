"use client"

import * as React from "react"
import { MessageSquare } from "lucide-react"
import { useTranslations } from "next-intl"

import { ChartConfig } from "@/components/ui/chart"
import { TimeRangeChart } from "@/components/common/time-range-chart"
import useCommentsStore from "./stores/useCommentsStore"
import useCommentsManagement from "./hooks/useCommentsManagement"
import { normalizeChartData } from "@/lib/utils"

const commentChartConfig = {
    count: {
        label: "New Comments",
        icon: MessageSquare,
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function CommentChart() {
    const t = useTranslations('Admin.comments.all.charts')
    const { chartData } = useCommentsStore()
    const [days, setDays] = React.useState(30)
    const { isDailyCommentLoading } = useCommentsManagement(undefined, days)

    const handleTimeRangeChange = (days: number) => {
        setDays(days)
    }

    return (
        <div className="mx-4">
            <TimeRangeChart
                defaultTimeRange="30"
                isLoading={isDailyCommentLoading}
                title={t('commentStatistic')}
                description={t('newCommentsDescription', { days })}
                chartConfig={commentChartConfig}
                onTimeRangeChange={handleTimeRangeChange}
                data={chartData ? normalizeChartData(chartData) : []}
            />
        </div>
    )
}
