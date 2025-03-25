'use client'

import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarProvider
} from "@/components/ui/sidebar";
import {useState} from "react";
import {cn} from "@/lib/utils";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {UserInformation} from "@/components/common/UserInformation";
import {setting_data} from "@/app/(home)/constraints/setting_data";

export const SettingsContainer = () => {
    const [sidebarOpenIndex, setSidebarOpenIndex] = useState(0);

    const switchSidebarContent = (index: number) => {
        setSidebarOpenIndex(index);
    }

    return (
        <SidebarProvider>
            <Sidebar className={'h-[500px]'}>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {setting_data.map((item, index) => (
                                    <SidebarMenuItem key={index}
                                                     className={cn(
                                                         (index === sidebarOpenIndex) && 'bg-gray-300',
                                                         'rounded transition duration-300'
                                                     )}>
                                        <SidebarMenuButton onClick={() => switchSidebarContent(index)}>
                                            {item.icon}
                                            <p className={cn(sidebarOpenIndex === index && 'font-bold text-zinc-800')}>{item.label}</p>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <UserInformation/>
                </SidebarFooter>
            </Sidebar>

            <section className={'w-[600px]'}>
                <header>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <p>Settings</p>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem >
                                <p className={'font-bold text-zinc-600'}>{setting_data[sidebarOpenIndex].label}</p>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <main>
                    {setting_data[sidebarOpenIndex].ui}
                </main>
            </section>
        </SidebarProvider>
    )
}

export default SettingsContainer;