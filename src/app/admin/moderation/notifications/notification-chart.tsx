"use client"

import * as React from "react"
import {ChartConfig} from "@/components/ui/chart"
import {useAdminNotification} from "@/app/admin/moderation/notifications/hooks/useAdminNotification";
import useAdminNotificationStore from "@/app/admin/moderation/notifications/stores/useAdminNotificationStore";
import {normalizeChartData} from "@/lib/utils";
import {useTranslations} from "next-intl";
import {TimeRangeChart} from "@/components/common/time-range-chart";

const chartConfig = {
    count: {
        label: "Notifications",
        color: "var(--chart-2)",
    }
} satisfies ChartConfig

export function NotificationChart() {
    const t = useTranslations("Admin.moderation.notifications.charts");
    const [timeRangeDays, setTimeRangeDays] = React.useState(30);

    const {chartData} = useAdminNotificationStore();
    const {isChartLoading} = useAdminNotification(timeRangeDays);

    return (
        <TimeRangeChart
            defaultTimeRange="30"
            isLoading={isChartLoading}
            title={t("title")}
            description={t("description", { days: timeRangeDays })}
            chartConfig={chartConfig}
            onTimeRangeChange={setTimeRangeDays}
            data={normalizeChartData(chartData || [])}
        />
    );
}
