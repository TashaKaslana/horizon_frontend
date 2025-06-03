import type { ChartConfig } from "@/components/ui/chart"
import { TopTagUsageDto } from "@/api/client"
import {NormalizedChartData} from "@/app/admin/components/chart-card";

const TAG_COLORS = [
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

export function generateChartConfig(raw: TopTagUsageDto[]): ChartConfig {
    const uniqueTags = Array.from(
        new Set(raw.map(d => d.tagName).filter(Boolean))
    ) as string[]

    const config: ChartConfig = {}

    uniqueTags.forEach((cat, index) => {
        const color = TAG_COLORS[index % TAG_COLORS.length]
        config[cat] = {
            label: cat,
            color: color
        }
    })

    return config
}

export function transformTopTagData(raw: TopTagUsageDto[]): NormalizedChartData[] {
    const groupedByDate: Record<string, Record<string, number>> = {}

    for (const item of raw) {
        const tag = item.tagName
        const date = item.postDate?.toString()
        const count = typeof item.postCount === "bigint" ? Number(item.postCount) : item.postCount

        if (!tag || !date || count == null) continue

        if (!groupedByDate[date]) groupedByDate[date] = {}
        groupedByDate[date][tag] = count
    }

    const allDates = Object.keys(groupedByDate).sort()
    const allTags = Array.from(new Set(raw.map(d => d.tagName).filter(Boolean))) as string[]

    return allDates.map(date => {
        const entry = { date } as NormalizedChartData;
        for (const cat of allTags) {
            entry[cat] = groupedByDate[date][cat] ?? 0;
        }

        return entry
    })
}