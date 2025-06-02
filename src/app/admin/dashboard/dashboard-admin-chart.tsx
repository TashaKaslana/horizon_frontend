'use client'

import React, { useState, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartCard } from "@/app/admin/components/chart-card"
import { ChartConfig } from "@/components/ui/chart"
import { Users, FileText, MessageSquare } from "lucide-react"
import useDashboardManagement from './hook/useDashboardManagement'
import useDashboardStore from './store/useDashboardStore'
import {normalizeChartData} from "@/lib/utils";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const userChartConfig = {
  count: {
    label: "New Users",
    icon: Users,
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const postChartConfig = {
  count: {
    label: "New Posts",
    icon: FileText,
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const commentChartConfig = {
  count: {
    label: "New Comments",
    icon: MessageSquare,
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function DashboardAdminChart() {
  const [activeTab, setActiveTab] = useState<"User" | "Post" | "Comment">("User")
  const [timeRange, setTimeRange] = React.useState("30d")

  const { userChartData, postChartData, commentChartData } = useDashboardStore()
  const {
    isUserChartLoading,
    isPostChartLoading,
    isCommentChartLoading
  } = useDashboardManagement(activeTab, castTime(timeRange))

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
  }

  const currentChartData = useMemo(() => {
    switch (activeTab) {
      case "User": return userChartData;
      case "Post": return postChartData;
      case "Comment": return commentChartData;
      default: return [];
    }
  }, [activeTab, userChartData, postChartData, commentChartData]);

  const isLoading = useMemo(() => {
    switch (activeTab) {
      case "User": return isUserChartLoading;
      case "Post": return isPostChartLoading;
      case "Comment": return isCommentChartLoading;
      default: return false;
    }
  }, [activeTab, isUserChartLoading, isPostChartLoading, isCommentChartLoading]);

  // Get chart config based on active tab
  const activeChartConfig = useMemo(() => {
    switch (activeTab) {
      case "User": return userChartConfig;
      case "Post": return postChartConfig;
      case "Comment": return commentChartConfig;
      default: return userChartConfig;
    }
  }, [activeTab]);

  // Get chart title based on active tab
  const chartTitle = useMemo(() => {
    switch (activeTab) {
      case "User": return "User Growth";
      case "Post": return "Content Creation";
      case "Comment": return "Community Engagement";
      default: return "Statistics";
    }
  }, [activeTab]);

  const chartDescription = useMemo(() => {
    switch (activeTab) {
      case "User": return "New user registrations by day";
      case "Post": return "Content created by day";
      case "Comment": return "Community interactions by day";
      default: return "Daily activity";
    }
  }, [activeTab]);

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="User"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "User" | "Post" | "Comment")}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-2 px-4">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="User" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="Post" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="Comment" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Comments</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex justify-end">
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
        </div>

        <TabsContent value={activeTab}>
          <ChartCard
            data={normalizeChartData(currentChartData)}
            isLoading={isLoading}
            title={chartTitle}
            description={chartDescription}
            chartConfig={activeChartConfig}
          />
        </TabsContent>
      </Tabs>
    </div>
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
