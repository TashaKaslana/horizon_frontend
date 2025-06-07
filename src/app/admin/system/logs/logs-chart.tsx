"use client"

import * as React from "react"
import useLoggingStore from "./useLoggingStore"
import {useLoggingManagement} from "./useLoggingManagement"
import {ChartConfig} from "@/components/ui/chart"
import {normalizeChartData} from "@/lib/utils";
import {useTranslations} from "next-intl";
import {TimeRangeChart} from "@/components/common/time-range-chart";

const chartConfig = {
    count: {
        label: "Error Logs",
        color: "var(--chart-5)",
    }
} satisfies ChartConfig

export function LogErrorChart() {
    const [days, setDays] = React.useState(30)
    const {logChartData} = useLoggingStore()
    const {isLogChartLoading} = useLoggingManagement(undefined, days)
    const t = useTranslations("Admin.system.logs.charts");

    const handleTimeRangeChange = (selectedDays: number) => {
        setDays(selectedDays);
    };

    const normalizedData = normalizeChartData(logChartData);

    return (
        <>
            <TimeRangeChart
                defaultTimeRange="30"
                isLoading={isLogChartLoading}
                title={t("title")}
                description={t("description", { days })}
                chartConfig={chartConfig}
                onTimeRangeChange={handleTimeRangeChange}
                data={normalizedData}
            />
        </>
    )
}
