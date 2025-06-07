'use client'

import React, { useState, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartConfig } from "@/components/ui/chart"
import { Users, FileText, MessageSquare } from "lucide-react"
import useDashboardManagement from './hook/useDashboardManagement'
import useDashboardStore from './store/useDashboardStore'
import { normalizeChartData } from "@/lib/utils"
import { TimeRangeChart } from "@/components/common/time-range-chart"
import { useTranslations } from "next-intl"

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
  const [days, setDays] = useState(30)
  const t = useTranslations('Admin.dashboard')

  const { userChartData, postChartData, commentChartData } = useDashboardStore()
  const {
    isUserChartLoading,
    isPostChartLoading,
    isCommentChartLoading
  } = useDashboardManagement(activeTab, days)

  // Get chart data based on active tab
  const currentChartData = useMemo(() => {
    switch (activeTab) {
      case "User": return normalizeChartData(userChartData);
      case "Post": return normalizeChartData(postChartData);
      case "Comment": return normalizeChartData(commentChartData);
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
      case "User": return t('charts.userGrowth');
      case "Post": return t('charts.contentCreation');
      case "Comment": return t('charts.communityEngagement');
      default: return t('charts.statistics');
    }
  }, [activeTab, t]);

  // Get chart description based on active tab and days
  const chartDescription = useMemo(() => {
    switch (activeTab) {
      case "User": return t('charts.descriptions.user', { days });
      case "Post": return t('charts.descriptions.post', { days });
      case "Comment": return t('charts.descriptions.comment', { days });
      default: return t('charts.descriptions.default', { days });
    }
  }, [activeTab, days, t]);

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
              <span className="hidden sm:inline">{t('tabs.user')}</span>
            </TabsTrigger>
            <TabsTrigger value="Post" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tabs.post')}</span>
            </TabsTrigger>
            <TabsTrigger value="Comment" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tabs.comment')}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab}>
          <TimeRangeChart
            defaultTimeRange={days === 90 ? "90" : days === 7 ? "7" : "30"}
            isLoading={isLoading}
            title={chartTitle}
            description={chartDescription}
            chartConfig={activeChartConfig}
            onTimeRangeChange={(selectedDays) => setDays(selectedDays)}
            data={currentChartData}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
