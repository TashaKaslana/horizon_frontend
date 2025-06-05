"use client"

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    Trash2
} from "lucide-react"
import { useNotificationStore } from "../store/useNotificationStore"
import { useNotification } from "../hooks/useNotification"
import { GroupType } from "@/types/Notification"
import { useTranslations } from "next-intl"

export default function NotificationHeader() {
    const t = useTranslations('Home.notifications');
    const {
        searchQuery,
        activeTab,
        readFilter,
        showSearch,
        setSearchQuery,
        setReadFilter,
        toggleSearch,
        groupedStats,
        allCount,
        allUnreadCount
    } = useNotificationStore()

    const {
        handleToggleAllReadStatus,
        handleDismissAllNotifications,
    } = useNotification()

    const unreadCount = allCount ?? 0
    const hasUnread = unreadCount > 0
    const groupType = activeTab as GroupType;

    const hasUnreadInTab = groupedStats[groupType]?.unreadCount > 0;

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center">
                        <span className="text-lg font-medium">{t('title')}</span>
                        <div className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                            {allCount}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-sm text-muted-foreground">{t('header.unread')}</span>
                        <div className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                            {allUnreadCount}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={toggleSearch}>
                                    <Search className="h-4 w-4" />
                                    <span className="sr-only">{t('header.tooltips.search')}</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('header.tooltips.search')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Select value={readFilter} onValueChange={setReadFilter}>
                        <SelectTrigger className="w-[130px]">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <SelectValue placeholder={t('header.tooltips.filter')} />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('header.filterOptions.all')}</SelectItem>
                            <SelectItem value="read">{t('header.filterOptions.read')}</SelectItem>
                            <SelectItem value="unread">{t('header.filterOptions.unread')}</SelectItem>
                        </SelectContent>
                    </Select>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">{t('header.actions.moreOptions')}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {hasUnread && (
                                <DropdownMenuItem onClick={() => handleToggleAllReadStatus(true)}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    {t('header.actions.markAllRead')}
                                </DropdownMenuItem>
                            )}
                            {hasUnreadInTab && (
                                <DropdownMenuItem onClick={() => handleToggleAllReadStatus(true)}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    {t('header.actions.markTabRead', { tab: activeTab })}
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={handleDismissAllNotifications}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('header.actions.clearAll')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {showSearch && (
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t('header.searchPlaceholder')}
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>
            )}
        </div>
    )
}
