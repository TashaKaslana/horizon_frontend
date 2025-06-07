"use client"

import * as React from "react"
import {useTranslations} from "next-intl"

import {ChartConfig} from "@/components/ui/chart"
import useUsersManagement from "@/app/admin/users/all/hooks/useUsersManagement";
import {TimeRangeChart} from "@/components/common/time-range-chart";
import useUsersStore from "@/app/admin/users/all/store/useUsersStore";
import {normalizeChartData} from "@/lib/utils";

export function UserAttendanceChart() {
    const [days, setDays] = React.useState(90);
    const t = useTranslations('Admin.users.all');
    const {chartData} = useUsersStore()
    const {isUserChartLoading} = useUsersManagement(undefined, days);

    const chartConfig = {
        visitors: {
            label: "Visitors",
        },
        count: {
            label: t('charts.newUsers'),
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    const timeRanges = [
        {value: "90", label: "charts.quarterly", days: 90},
        {value: "30", label: "charts.monthly", days: 30},
        {value: "7", label: "charts.weekly", days: 7}
    ];

    return (
        <TimeRangeChart
            data={normalizeChartData(chartData)}
            defaultTimeRange="90"
            timeRanges={timeRanges}
            isLoading={isUserChartLoading}
            title={t('charts.userAttendance')}
            description={t('charts.userAttendanceDescription', {days})}
            chartConfig={chartConfig}
            onTimeRangeChange={setDays}
        />
    )
}
