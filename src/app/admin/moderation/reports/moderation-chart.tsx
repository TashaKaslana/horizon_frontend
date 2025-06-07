"use client"

import * as React from "react"
import {useReportStore} from "./useReportStore"
import {useModeration} from "./useModeration"
import {ChartConfig} from "@/components/ui/chart"
import {normalizeChartData} from "@/lib/utils"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Users, FileText, MessageSquare} from "lucide-react"
import {useTranslations} from "next-intl"
import {TimeRangeChart} from "@/components/common/time-range-chart"

const moderationChartConfig = {
    pendingCount: {
        label: "Pending",
        color: "var(--chart-1)",
    },
    resolvedCount: {
        label: "Resolved",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

type ModerationChartType = "ALL" | "USER" | "POST" | "COMMENT"

export function ModerationChart({type = "ALL", isSpecific = false}: {
    type?: ModerationChartType,
    isSpecific?: boolean
}) {
    const t = useTranslations("Admin.moderation.all.charts")
    const tType = useTranslations('Admin.moderation.all.type')

    const [activeTab, setActiveTab] = React.useState<ModerationChartType>(type)
    const [timeRangeDays, setTimeRangeDays] = React.useState(30)

    const {chartData, userChartData, postChartData, commentChartData} = useReportStore()
    const {isDailyDataLoading} = useModeration({
        type: activeTab === "ALL" ? undefined : activeTab,
        timeRange: timeRangeDays
    })

    const currentChartData = React.useMemo(() => {
        switch (activeTab) {
            case "ALL":
                return chartData;
            case "USER":
                return userChartData;
            case "POST":
                return postChartData;
            case "COMMENT":
                return commentChartData;
            default:
                return chartData;
        }
    }, [activeTab, chartData, userChartData, postChartData, commentChartData]);

    // Format chart data for the current tab
    const formattedChartData = React.useMemo(() => {
        if (!currentChartData || currentChartData.length === 0) {
            return []
        }

        return normalizeChartData(currentChartData)
    }, [currentChartData])

    // Get chart title based on active tab
    const chartTitle = React.useMemo(() => {
        switch (activeTab) {
            case "ALL":
                return t("reportActivity");
            case "USER":
                return t("reportDistribution");
            case "POST":
                return t("reportGrowth");
            case "COMMENT":
                return t("reportStatistic");
            default:
                return t("reportActivity");
        }
    }, [activeTab, t]);

    const chartDescription = React.useMemo(() => {
        return t("newReportsDescription", { days: timeRangeDays });
    }, [timeRangeDays, t]);

    // If isSpecific is true, only render the chart for the specific type without tabs
    if (isSpecific) {
        return (
            <div className="space-y-4">
                <TimeRangeChart
                    defaultTimeRange="30"
                    isLoading={isDailyDataLoading}
                    title={chartTitle}
                    description={chartDescription}
                    chartConfig={moderationChartConfig}
                    onTimeRangeChange={setTimeRangeDays}
                    data={formattedChartData}
                />
            </div>
        )
    }

    // Otherwise, render the full tabbed interface
    return (
        <div className="space-y-4">
            <Tabs className="flex justify-between items-center mb-2 px-4" defaultValue={"ALL"}>
                <div className={'w-full flex items-center justify-between px-4'}>
                    <TabsList className="grid grid-cols-4 w-[500px]">
                        <TabsTrigger
                            value="ALL"
                            onClick={() => setActiveTab("ALL")}
                            data-active={activeTab === "ALL"}
                            className="flex items-center gap-2"
                        >
                            <span className="hidden sm:inline">{tType('all')}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="USER"
                            onClick={() => setActiveTab("USER")}
                            data-active={activeTab === "USER"}
                            className="flex items-center gap-2"
                        >
                            <Users size={16}/>
                            <span className="hidden sm:inline">{tType('user')}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="POST"
                            onClick={() => setActiveTab("POST")}
                            data-active={activeTab === "POST"}
                            className="flex items-center gap-2"
                        >
                            <FileText size={16}/>
                            <span className="hidden sm:inline">{tType('post')}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="COMMENT"
                            onClick={() => setActiveTab("COMMENT")}
                            data-active={activeTab === "COMMENT"}
                            className="flex items-center gap-2"
                        >
                            <MessageSquare size={16}/>
                            <span className="hidden sm:inline">{tType('comment')}</span>
                        </TabsTrigger>
                    </TabsList>
                </div>
            </Tabs>

            <TimeRangeChart
                defaultTimeRange="30"
                isLoading={isDailyDataLoading}
                title={chartTitle}
                description={chartDescription}
                chartConfig={moderationChartConfig}
                onTimeRangeChange={setTimeRangeDays}
                data={formattedChartData}
            />
        </div>
    )
}
