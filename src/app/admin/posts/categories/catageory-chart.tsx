import * as React from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ChartCard} from "@/app/admin/components/chart-card";
import useCategoryStore from "@/app/admin/posts/categories/store/useCategoryStore";
import {useCategoryManagement} from "@/app/admin/posts/categories/hooks/useCategoryManagement";
import {generateChartConfig, transformTopCategoryData} from "@/app/admin/posts/categories/transform-generate-chart";

export function CategoryChart() {
    const [timeRange, setTimeRange] = React.useState("7d")
    const {chartData} = useCategoryStore()
    const {isDailyCountLoading} = useCategoryManagement(castTime(timeRange))

    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value)
    }

    return (
        <>
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
                data={transformTopCategoryData(chartData)}
                isLoading={isDailyCountLoading}
                title="Category Statistic"
                description={`Showing new category per day for the last ${castTime(timeRange)} days`}
                chartConfig={generateChartConfig(chartData)}
            />
        </>
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