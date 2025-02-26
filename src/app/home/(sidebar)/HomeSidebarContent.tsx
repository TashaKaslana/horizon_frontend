import {Compass, House, MailboxIcon, MoreHorizontal, PackageSearch, Upload, User, Users} from "lucide-react";
import {SidebarContent, SidebarMenu, SidebarMenuItem, SidebarSeparator} from "@/components/ui/sidebar";
import {Input} from "@/components/ui/input";
import Link from "next/link";

export const HomeSidebarContent = () => {
    const items = [
        {title: 'For you', icon: <House/>, href: '/'},
        {title: 'Discover', icon: <Compass/>, href: '/'},
        {title: 'Management', icon: <PackageSearch/>, href: '/'},
        {title: 'Uploads', icon: <Upload/>, href: '/'},
        {title: 'Friends', icon: <Users/>, href: '/'},
        {title: 'Following', icon: <User/>, href: '/'},
        {title: 'Notifications', icon: <MailboxIcon/>, href: '/'},
        {title: 'More', icon: <MoreHorizontal/>, href: '/'}
    ]

    return (
        <SidebarContent className={'p-1'}>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Input placeholder={'Searching'}/>
                </SidebarMenuItem>

                <SidebarSeparator className={'mx-0'}/>

                {items.map((item, index) =>
                    <SidebarMenuItem key={index}>
                        <Link href={'/'}
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