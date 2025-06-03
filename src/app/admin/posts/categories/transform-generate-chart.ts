import type { ChartConfig } from "@/components/ui/chart"
import { TopCategoryUsageDto } from "@/api/client"
import {NormalizedChartData} from "@/app/admin/components/chart-card";

const CATEGORY_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
    "var(--chart-7)",
    "var(--chart-8)",
    "var(--chart-9)",
    "var(--chart-10)",
]

export function generateChartConfig(raw: TopCategoryUsageDto[]): ChartConfig {
    const uniqueCategories = Array.from(
        new Set(raw.map(d => d.categoryName).filter(Boolean))
    ) as string[]

    const config: ChartConfig = {}

    uniqueCategories.forEach((cat, index) => {
        const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length]
        config[cat] = {
            label: cat,
            color: color
        }
    })

    return config
}

export function transformTopCategoryData(raw: TopCategoryUsageDto[]): NormalizedChartData[] {
    const groupedByDate: Record<string, Record<string, number>> = {}

    for (const item of raw) {
        const category = item.categoryName
        const date = item.postDate?.toString()
        const count = typeof item.postCount === "bigint" ? Number(item.postCount) : item.postCount

        if (!category || !date || count == null) continue

        if (!groupedByDate[date]) groupedByDate[date] = {}
        groupedByDate[date][category] = count
    }

    const allDates = Object.keys(groupedByDate).sort()
    const allCategories = Array.from(new Set(raw.map(d => d.categoryName).filter(Boolean))) as string[]

    return allDates.map(date => {
        const entry = { date } as NormalizedChartData;
        for (const cat of allCategories) {
            entry[cat] = groupedByDate[date][cat] ?? 0;
        }

        return entry
    })
}
