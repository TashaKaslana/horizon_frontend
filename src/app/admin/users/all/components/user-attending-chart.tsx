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
        count: {
            label: t('charts.newUsers'),
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig;

    return (
        <TimeRangeChart
            data={normalizeChartData(chartData)}
            defaultTimeRange="90"
            isLoading={isUserChartLoading}
            title={t('charts.userAttendance')}
            description={t('charts.userAttendanceDescription', {days})}
            chartConfig={chartConfig}
            onTimeRangeChange={setDays}
        />
    )
}
