import {SidebarContent, SidebarMenu, SidebarMenuItem, SidebarSeparator} from "@/components/ui/sidebar";
import Link from "next/link";
import {SearchBar} from "@/app/(home)/_components/searchbar/SearchBar";
import {navigationData} from "@/app/(home)/constraints/navigation_data";

export const HomeSidebarContent = () => {
    return (
        <SidebarContent className={'p-1'}>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SearchBar/>
                </SidebarMenuItem>

                <SidebarSeparator className={'mx-0'}/>

                {navigationData.map((item, index) =>
                    <SidebarMenuItem key={index}>
                        <Link href={item.href}
                              className={'group box-border flex p-1 gap-2 justify-start border border-transparent ' +
                                  'hover:border-gray-300 items-center transition-colors duration-500 rounded ' +
                                  'hover:bg-gray-200'}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarContent>
    )
}