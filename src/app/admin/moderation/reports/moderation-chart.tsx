"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useReportStore} from "./useReportStore"
import {useModeration} from "./useModeration"
import {ChartCard} from "@/app/admin/components/chart-card"
import {ChartConfig} from "@/components/ui/chart"
import {normalizeChartData} from "@/lib/utils"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Users, FileText, MessageSquare} from "lucide-react"

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
    const [timeRange, setTimeRange] = React.useState("30d")
    const [activeTab, setActiveTab] = React.useState<ModerationChartType>(type)

    const {chartData, userChartData, postChartData, commentChartData} = useReportStore()
    const {isDailyDataLoading} = useModeration({
        type: activeTab === "ALL" ? undefined : activeTab,
        timeRange: getDaysFromTimeRange(timeRange)
    })

    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value)
    }

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
                return "All Moderation Reports";
            case "USER":
                return "User Report Trends";
            case "POST":
                return "Post Report Trends";
            case "COMMENT":
                return "Comment Report Trends";
            default:
                return "Moderation Reports";
        }
    }, [activeTab]);

    // Get chart description based on active tab
    const chartDescription = React.useMemo(() => {
        switch (activeTab) {
            case "ALL":
                return `Showing all report activity for the last ${getDaysFromTimeRange(timeRange)} days`;
            case "USER":
                return `Showing user report activity for the last ${getDaysFromTimeRange(timeRange)} days`;
            case "POST":
                return `Showing post report activity for the last ${getDaysFromTimeRange(timeRange)} days`;
            case "COMMENT":
                return `Showing comment report activity for the last ${getDaysFromTimeRange(timeRange)} days`;
            default:
                return `Showing moderation activity for the last ${getDaysFromTimeRange(timeRange)} days`;
        }
    }, [activeTab, timeRange]);

    // If isSpecific is true, only render the chart for the specific type without tabs
    if (isSpecific) {
        return (
            <div className="space-y-4">
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
                    data={formattedChartData}
                    isLoading={isDailyDataLoading}
                    title={chartTitle}
                    description={chartDescription}
                    chartConfig={moderationChartConfig}
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
                            <span className="hidden sm:inline">All</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="USER"
                            onClick={() => setActiveTab("USER")}
                            data-active={activeTab === "USER"}
                            className="flex items-center gap-2"
                        >
                            <Users className="h-4 w-4"/>
                            <span className="hidden sm:inline">Users</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="POST"
                            onClick={() => setActiveTab("POST")}
                            data-active={activeTab === "POST"}
                            className="flex items-center gap-2"
                        >
                            <FileText className="h-4 w-4"/>
                            <span className="hidden sm:inline">Posts</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="COMMENT"
                            onClick={() => setActiveTab("COMMENT")}
                            data-active={activeTab === "COMMENT"}
                            className="flex items-center gap-2"
                        >
                            <MessageSquare className="h-4 w-4"/>
                            <span className="hidden sm:inline">Comments</span>
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex justify-end">
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
                </div>
                <div className={'w-full'}>
                    <ChartCard
                        data={formattedChartData}
                        isLoading={isDailyDataLoading}
                        title={chartTitle}
                        description={chartDescription}
                        chartConfig={moderationChartConfig}
                    />
                </div>
            </Tabs>
        </div>
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
