"use client"

import React from "react"
import useTagStore from "./store/useTagStore"
import {useTagManagement} from "./hooks/useTagManagement"
import {generateChartConfig, transformTopTagData} from "@/app/admin/posts/tags/transform-gen-tags";
import {TimeRangeChart} from "@/components/common/time-range-chart";
import {useTranslations} from "next-intl";

export function TagsChart() {
    const [days, setDays] = React.useState(30)
    const {dailyUsageCount} = useTagStore()
    const {isDailyUsageCountLoading} = useTagManagement(days)
    const t = useTranslations("Admin.posts.tags.charts");

    const handleTimeRangeChange = (selectedDays: number) => {
        setDays(selectedDays);
    };

    return (
        <>
            <TimeRangeChart
                defaultTimeRange="30"
                isLoading={isDailyUsageCountLoading}
                title={t("title")}
                description={t("description", { days })}
                chartConfig={generateChartConfig(dailyUsageCount)}
                onTimeRangeChange={handleTimeRangeChange}
                data={transformTopTagData(dailyUsageCount)}
            />
        </>
    )
}
