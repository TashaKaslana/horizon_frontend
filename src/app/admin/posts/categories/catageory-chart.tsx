import * as React from "react";
import useCategoryStore from "@/app/admin/posts/categories/store/useCategoryStore";
import {useCategoryManagement} from "@/app/admin/posts/categories/hooks/useCategoryManagement";
import {generateChartConfig, transformTopCategoryData} from "@/app/admin/posts/categories/transform-generate-chart";
import {TimeRangeChart} from "@/components/common/time-range-chart";
import {useTranslations} from "next-intl";

export function CategoryChart() {
    const [days, setDays] = React.useState(7);
    const {chartData} = useCategoryStore();
    const {isDailyCountLoading} = useCategoryManagement(days);
    const t = useTranslations("Admin.posts.categories.charts");

    const handleTimeRangeChange = (selectedDays: number) => {
        setDays(selectedDays);
    };

    return (
        <TimeRangeChart
            defaultTimeRange="7"
            isLoading={isDailyCountLoading}
            title={t("title")}
            description={t("description", {days})}
            chartConfig={generateChartConfig(chartData)}
            onTimeRangeChange={handleTimeRangeChange}
            data={transformTopCategoryData(chartData)}
        />
    );
}