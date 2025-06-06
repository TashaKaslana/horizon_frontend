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
import {useTranslations} from "next-intl";

export const SettingsContainer = () => {
    const [sidebarOpenIndex, setSidebarOpenIndex] = useState(0);
    const settingsT = useTranslations("Home.user_dialog.settings_dialog");

    const switchSidebarContent = (index: number) => {
        setSidebarOpenIndex(index);
    }

    return (
        <SidebarProvider>
            <Sidebar className={'h-full'}>
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
                                <p>{settingsT("title")}</p>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem >
                                <p className={'font-bold text-zinc-600'}>{setting_data[sidebarOpenIndex].label}</p>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <main className="py-1">
                    {setting_data[sidebarOpenIndex].ui}
                </main>
            </section>
        </SidebarProvider>
    )
}

export default SettingsContainer;