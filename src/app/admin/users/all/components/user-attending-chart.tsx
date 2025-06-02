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
import useUsersStore from "@/app/admin/users/all/store/useUsersStore";
import useUsersManagement from "@/app/admin/users/all/hooks/useUsersManagement";
import {Spinner} from "@/components/ui/spinner";

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    count: {
        label: "New Users",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function UserAttendanceChart() {
    const [timeRange, setTimeRange] = React.useState("90")

    const {chartData} = useUsersStore()
    const {isUserChartLoading} = useUsersManagement(undefined, parseInt(timeRange))

    return (
        <Card className={'mx-4'}>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Area Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing total new user for the last {parseInt(timeRange)} days
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months"/>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {
                    isUserChartLoading ? <Spinner show={isUserChartLoading}/> :
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
                    </ChartContainer>}
            </CardContent>
        </Card>
    )
}
