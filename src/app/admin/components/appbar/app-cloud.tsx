"use client"

import { type LucideIcon, ChevronRight } from "lucide-react"
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu
} from "@/components/ui/sidebar";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";

export interface NavCloudItemType {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: NavCloudSubItemType[];
}

interface NavCloudSubItemType {
    title: string;
    url: string;
}

export function NavSystem({ items }: { items: NavCloudItemType[] }) {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => {
                        const isCurrentItemActive = pathname === item.url;
                        const isAnySubItemActive =
                            item.items?.some((sub) => pathname === sub.url) ?? false;
                        const isMainItemActive = isCurrentItemActive || isAnySubItemActive;

                        return item.items?.length ? (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={isMainItemActive}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title} isActive={isMainItemActive}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                                        <Link href={subItem.url}>{subItem.title}</Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : (
                            <Link key={item.title} href={item.url}>
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton tooltip={item.title} isActive={pathname === item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </Link>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

