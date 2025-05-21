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
import {useEffect} from "react";
import { NavSystem } from "@/app/admin/components/appbar/app-cloud";

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
            subItems: [
                { title: "All Users", url: "/admin/users/all" },
                { title: "Reports", url: "/admin/users/reports" },
                { title: "Roles", url: "/admin/users/roles" },
                { title: "Permissions", url: "/admin/users/permissions" },
            ],
        },
        {
            title: "Posts",
            url: "/admin/posts",
            icon: FileTextIcon,
            subItems: [
                { title: "All Posts", url: "/admin/posts/all" },
                { title: "Reports", url: "/admin/posts/reports" },
                { title: "Categories", url: "/admin/posts/categories" },
                { title: "Tags", url: "/admin/posts/tags" },
            ],
        },
        {
            title: "Comments",
            url: "/admin/comments",
            icon: MessageSquareIcon,
            subItems: [
                { title: "All Comments", url: "/admin/comments/all" },
                { title: "Reports", url: "/admin/comments/reports" },
            ],
        },
        {
            title: "Moderation",
            url: "/admin/moderation",
            icon: ShieldCheckIcon,
            subItems: [
                { title: "All Reports", url: "/admin/moderation/reports" },
                { title: "User Reports", url: "/admin/users/reports" },
                { title: "Post Reports", url: "/admin/posts/reports" },
                { title: "Comment Reports", url: "/admin/comments/reports" },
                { title: "Notifications", url: "/admin/notifications" },
            ],
        },
    ],

    navSystem: [
        {
            title: "System",
            icon: ServerIcon,
            url: "#",
            items: [
                { title: "Status & Uptime", url: "/admin/system/status" },
                { title: "Maintenance Mode", url: "/admin/system/maintenance" },
                { title: "External Services", url: "/admin/system/services" },
            ],
        },
        {
            title: "Logs",
            icon: ListIcon,
            url: "/admin/logs",
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
};

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
