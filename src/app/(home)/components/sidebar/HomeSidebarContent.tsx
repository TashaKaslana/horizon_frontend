'use client'
import {
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator, useSidebar
} from "@/components/ui/sidebar";
import Link from "next/link";
import {SearchBar} from "@/app/(home)/components/searchbar/SearchBar";
import {navigationData} from "@/app/(home)/constraints/navigation_data";

export const HomeSidebarContent = () => {
    const {state} = useSidebar()

    return (
        <SidebarContent className={'p-1'}>
            <SidebarMenu>
                {state !== 'collapsed' && (
                    <SidebarMenuItem>
                        <SearchBar/>
                    </SidebarMenuItem>
                )}

                <SidebarSeparator className={'mx-0'}/>

                {navigationData.map((item, index) =>
                    <SidebarMenuItem key={index}>
                        <Link href={item.href}>
                            <SidebarMenuButton>
                                {item.icon}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarContent>
    )
}