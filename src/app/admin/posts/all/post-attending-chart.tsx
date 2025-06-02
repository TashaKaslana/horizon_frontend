"use client"

import * as React from "react"
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import usePostsStore from "@/app/admin/posts/all/stores/usePostsStore";
import {FileText} from "lucide-react";
import {usePostsManagement} from "@/app/admin/posts/all/hooks/usePostsManagement";
import {Spinner} from "@/components/ui/spinner";

const chartConfig = {
    count: {
        label: "New Posts",
        icon: FileText,
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function PostChart() {
    const [timeRange, setTimeRange] = React.useState("30d")

    const {chartData} = usePostsStore()
    const {isDailyPostCountLoading} = usePostsManagement(undefined, castTime(timeRange))

    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value)
    }

    return (
        <Card className={'mx-4'}>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Post Statistic</CardTitle>
                    <CardDescription>
                        Showing new posts per day for the last {castTime(timeRange)} days
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 30 days"/>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 h-[250px]">
                {
                    isDailyPostCountLoading ? (
                            <Spinner show={isDailyPostCountLoading}/>
                        ) :
                        (
                            <ChartContainer
                                config={chartConfig}
                                className="aspect-auto h-[250px] w-full"
                            >
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="count" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="var(--chart-1)"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="var(--chart-1)"
                                                stopOpacity={0.1}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false}/>
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={32}
                                        tickFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                labelFormatter={(value) => {
                                                    return new Date(value).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    })
                                                }}
                                                indicator="dot"
                                            />
                                        }
                                    />
                                    <Area
                                        dataKey="count"
                                        type="natural"
                                        fill="url(#fillMobile)"
                                        stroke="var(--chart-2)"
                                        stackId="a"
                                    />
                                    <ChartLegend content={<ChartLegendContent/>}/>
                                </AreaChart>
                            </ChartContainer>
                        )}
            </CardContent>
        </Card>
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
