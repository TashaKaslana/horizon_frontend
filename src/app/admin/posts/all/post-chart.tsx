"use client"

import * as React from "react"
import { FileText } from "lucide-react"
import { useTranslations } from "next-intl"

import { ChartConfig } from "@/components/ui/chart"
import { TimeRangeChart } from "@/components/common/time-range-chart"
import { usePostsSync } from "@/app/admin/posts/all/hooks/usePostsSync"
import usePostsStore from "@/app/admin/posts/all/stores/usePostsStore"
import {normalizeChartData} from "@/lib/utils";

const chartConfig = {
    count: {
        label: "New Posts",
        icon: FileText,
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function PostChart() {
    const t = useTranslations('Admin.posts.all.charts')
    const { chartData } = usePostsStore()
    const [days, setDays] = React.useState(30)
    const { isDailyPostCountLoading } = usePostsSync(undefined, days)

    const handleTimeRangeChange = (days: number) => {
        setDays(days)
    }

    return (
        <div className="mx-4">
            <TimeRangeChart
                defaultTimeRange="30"
                isLoading={isDailyPostCountLoading}
                title={t('postStatistic')}
                description={t('newPostsDescription', { days })}
                chartConfig={chartConfig}
                onTimeRangeChange={handleTimeRangeChange}
                data={normalizeChartData(chartData)}
            />
        </div>
    )
}
