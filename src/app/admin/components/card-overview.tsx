import {TrendingDownIcon, TrendingUpIcon} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface CardData {
    title: string
    value: string
    trend: number
    message: string
    description: string
}

export function OverviewCard({data}: { data: CardData }) {
    const isTrendPositive = data.trend >= 0
    const TrendIcon = isTrendPositive ? TrendingUpIcon : TrendingDownIcon

    return (
        <Card className="@container/card">
            <CardHeader className="relative">
                <CardDescription>{data.title}</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                    {data.value}
                </CardTitle>
                <div className="absolute right-4 top-4">
                    <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                        <TrendIcon className="size-3"/>
                        {isTrendPositive ? '+' : ''}{data.trend}%
                    </Badge>
                </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {data.message} <TrendIcon className="size-4"/>
                </div>
                <div className="text-muted-foreground">
                    {data.description}
                </div>
            </CardFooter>
        </Card>
    )
}