"use client"

import * as React from "react"
import {
    ArrowUpCircleIcon,
    ClipboardListIcon,
    DatabaseIcon,
    FileIcon,
    FileTextIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    ListIcon,
    SearchIcon,
    MessageSquareIcon,
    SettingsIcon,
    UsersIcon,
    ShieldCheckIcon, ServerIcon,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar"
import {UserAssistance} from "@/app/components/user_dialog/UserAssistance";
import {NavDocuments} from "@/app/admin/components/appbar/app-document";
import {NavMain} from "@/app/admin/components/appbar/app-main";
import {NavSecondary} from "@/app/admin/components/appbar/app-secondary";
import {useEffect, useMemo} from "react";
import { NavSystem } from "@/app/admin/components/appbar/app-cloud";
import {useTranslations} from "next-intl";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [isCollapsible, setIsCollapsible] = React.useState(false)
    const {state} = useSidebar()
    const t = useTranslations('Admin.appBar')
    const tSystem = useTranslations('Admin.system')

    const data = useMemo(() => ({
        navMain: [
            {
                title: t('dashboard'),
                url: '/admin/dashboard',
                icon: LayoutDashboardIcon,
            },
            {
                title: t('users'),
                url: '/admin/users',
                icon: UsersIcon,
                subItems: [
                    { title: t('allUsers'), url: '/admin/users/all' },
                    { title: t('userReports'), url: '/admin/users/reports' },
                    { title: t('roles'), url: '/admin/users/roles' },
                    { title: t('permissions'), url: '/admin/users/permissions' },
                ],
            },
            {
                title: t('posts'),
                url: '/admin/posts',
                icon: FileTextIcon,
                subItems: [
                    { title: t('allPosts'), url: '/admin/posts/all' },
                    { title: t('postReports'), url: '/admin/posts/reports' },
                    { title: t('categories'), url: '/admin/posts/categories' },
                    { title: t('tags'), url: '/admin/posts/tags' },
                ],
            },
            {
                title: t('comments'),
                url: '/admin/comments',
                icon: MessageSquareIcon,
                subItems: [
                    { title: t('allComments'), url: '/admin/comments/all' },
                    { title: t('commentReports'), url: '/admin/comments/reports' },
                ],
            },
            {
                title: t('moderation'),
                url: '/admin/moderation',
                icon: ShieldCheckIcon,
                subItems: [
                    { title: t('allReports'), url: '/admin/moderation/reports' },
                    { title: t('userReportsNav'), url: '/admin/users/reports' },
                    { title: t('postReportsNav'), url: '/admin/posts/reports' },
                    { title: t('commentReportsNav'), url: '/admin/comments/reports' },
                    { title: t('notifications'), url: '/admin/moderation/notifications' },
                ],
            },
        ],
        navSystem: [
            {
                title: t('system'),
                icon: ServerIcon,
                url: '#',
                items: [
                    { title: tSystem('statusUptimeNav'), url: '/admin/system/status' },
                    { title: t('maintenance'), url: '/admin/system/maintenance' },
                    { title: t('databaseSchema'), url: '/admin/system/database-schema' },
                ],
            },
            {
                title: t('logs'),
                icon: ListIcon,
                url: '/admin/system/logs',
            },
        ],
        navSecondary: [
            {
                title: t('settings'),
                url: '/admin/settings',
                icon: SettingsIcon,
            },
            {
                title: t('getHelp'),
                url: '/support',
                icon: HelpCircleIcon,
            },
            {
                title: t('search'),
                url: '#',
                icon: SearchIcon,
            },
        ],
        documents: [
            {
                name: t('userGuide'),
                url: 'docs/user-guide',
                icon: FileIcon,
            },
            {
                name: t('apiReference'),
                url: '/admin/docs/api',
                icon: ClipboardListIcon,
            },
            {
                name: t('databaseSchema'),
                url: 'docs/database',
                icon: DatabaseIcon,
            },
        ],
    }), [t, tSystem])
    
    useEffect(() => {
        if (state === 'collapsed') {
            setIsCollapsible(true)
        } else {
            setIsCollapsible(false)
        }
    }, [state])

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <ArrowUpCircleIcon className="h-5 w-5" />
                                <span className="text-base font-semibold">Horizon</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSystem items={data.navSystem} />
                <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <UserAssistance isCollapsible={isCollapsible}/>
            </SidebarFooter>
        </Sidebar>
    )
}
