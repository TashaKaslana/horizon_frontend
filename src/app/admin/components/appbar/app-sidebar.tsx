"use client"

import * as React from "react"
import {
    ArrowUpCircleIcon,
    ClipboardListIcon,
    DatabaseIcon,
    FileIcon,
    FileTextIcon,
    FolderIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    ListIcon,
    SearchIcon,
    MessageSquareIcon,
    SettingsIcon,
    UsersIcon,
    BellIcon,
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
import {useEffect} from "react";

const data = {
    user: {
        name: "Admin",
        email: "admin@example.com",
        avatar: "/avatars/admin.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: LayoutDashboardIcon,
        },
        {
            title: "Users",
            url: "/admin/users",
            icon: UsersIcon,
        },
        {
            title: "Posts",
            url: "/admin/posts",
            icon: FileTextIcon,
        },
        {
            title: "Comments",
            url: "/admin/comments",
            icon: MessageSquareIcon,
        },
        {
            title: "Categories",
            url: "/admin/categories",
            icon: FolderIcon,
        },
    ],
    navClouds: [
        {
            title: "Notifications",
            icon: BellIcon,
            url: "#",
            isActive: true,
            items: [
                {
                    title: "All Notifications",
                    url: "/admin/notifications",
                },
                {
                    title: "Unread",
                    url: "/admin/notifications/unread",
                },
            ],
        },
        {
            title: "Logs",
            icon: ListIcon,
            url: "#",
            items: [
                {
                    title: "System Logs",
                    url: "/admin/logs/system",
                },
                {
                    title: "User Activity",
                    url: "/admin/logs/activity",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "/admin/settings",
            icon: SettingsIcon,
        },
        {
            title: "Get Help",
            url: "/support",
            icon: HelpCircleIcon,
        },
        {
            title: "Search",
            url: "#",
            icon: SearchIcon,
        },
    ],
    documents: [
        {
            name: "User Guide",
            url: "/docs/user-guide",
            icon: FileIcon,
        },
        {
            name: "API Reference",
            url: "/docs/api",
            icon: ClipboardListIcon,
        },
        {
            name: "Database Schema",
            url: "/docs/database",
            icon: DatabaseIcon,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [isCollapsible, setIsCollapsible] = React.useState(false)
    const {state} = useSidebar()
    
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
                                <span className="text-base font-semibold">Acme Inc.</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <UserAssistance isCollapsible={isCollapsible}/>
            </SidebarFooter>
        </Sidebar>
    )
}
