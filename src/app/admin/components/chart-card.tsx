"use client"

import * as React from "react"
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
} from "recharts"
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
import {Spinner} from "@/components/ui/spinner"
import {cn} from "@/lib/utils";

export type NormalizedChartData = { date: string } & Record<string, number>

interface ChartCardProps {
    data?: NormalizedChartData[]
    isLoading: boolean
    title: string
    description: string
    chartConfig: ChartConfig
    tooltipClassName?: string
}

export function ChartCard({
                              data,
                              isLoading,
                              title,
                              description,
                              chartConfig,
                              tooltipClassName
                          }: ChartCardProps) {
    return (
        <Card className="mx-4">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 h-[250px]">
                {isLoading ? (
                    <Spinner show={isLoading}/>
                ) : !data || data.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No data available
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                        <AreaChart data={data}>
                            <defs>
                                {Object.entries(chartConfig).map(([key, config]) => (
                                    <linearGradient id={key} key={key} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={config.color} stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor={config.color} stopOpacity={0.1}/>
                                    </linearGradient>
                                ))}
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
                                        className={cn('w-fit', tooltipClassName)}
                                    />
                                }
                            />
                            {Object.keys(chartConfig).map((key) => (
                                <Area
                                    key={key}
                                    type="natural"
                                    dataKey={key}
                                    stroke={chartConfig[key].color}
                                    fill={`url(#${key})`}
                                    stackId="a"
                                />
                            ))}
                            <ChartLegend content={<ChartLegendContent/>}/>
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}

