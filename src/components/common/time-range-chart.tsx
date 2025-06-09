"use client"

import * as React from "react"

import {
    ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {ChartCard, NormalizedChartData} from "@/app/admin/components/chart-card"
import {useTranslations} from "next-intl";
import { Button } from "../ui/button"
import {exportToExcel} from "@/lib/utils";

export type TimeRange = {
    value: string;
    label: string;
    days: number;
}

export type TimeRangeChartProps = {
    defaultTimeRange?: string;
    timeRanges?: TimeRange[];
    isLoading: boolean;
    title: string;
    description: string;
    chartConfig: ChartConfig;
    onTimeRangeChange?: (days: number) => void;
    chartType?: string;
    data: NormalizedChartData[]
}

const useTimeRangeLocales = (): TimeRange[] => {
    const t = useTranslations("Admin.charts.timeRanges")
    return [
        {value: "90", label: t("quarterly"), days: 90},
        {value: "30", label: t("monthly"), days: 30},
        {value: "7", label: t("weekly"), days: 7},
    ]
}

export function TimeRangeChart({
                                   defaultTimeRange = "90",
                                   timeRanges: propTimeRanges,
                                   isLoading,
                                   title,
                                   description,
                                   chartConfig,
                                   onTimeRangeChange,
                                   data = [],
                               }: TimeRangeChartProps) {
    const t = useTranslations("Admin.charts.actions")
    const localizedTimeRanges = useTimeRangeLocales()
    const timeRanges = propTimeRanges && propTimeRanges.length > 0 ? propTimeRanges : localizedTimeRanges

    const [timeRange, setTimeRange] = React.useState(defaultTimeRange)

    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value);
        const selectedRange = timeRanges.find(range => range.value === value);
        if (selectedRange && onTimeRangeChange) {
            onTimeRangeChange(selectedRange.days);
        }
    }

    return (
        <div className={'space-y-4 py-2'}>
            <div className={'flex justify-end gap-2 items-center'}>
                <Button onClick={() => exportToExcel(data, `${title}.xlsx`, title)}>
                    {t('exportToExcel')}
                </Button>
                <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg mr-4"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder={timeRanges[0].label}/>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {timeRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value} className="rounded-lg">
                                {range.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <ChartCard
                data={data}
                isLoading={isLoading}
                title={title}
                description={description}
                chartConfig={chartConfig}
            />
        </div>
    )
}
