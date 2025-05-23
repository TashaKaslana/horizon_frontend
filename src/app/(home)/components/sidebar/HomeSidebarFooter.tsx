'use client'
import {SidebarFooter, useSidebar} from "@/components/ui/sidebar";
import { UserAssistance } from "@/app/components/user_dialog/UserAssistance";

export const HomeSidebarFooter = () => {
    const {state} = useSidebar()

    return (
        <SidebarFooter>
            <UserAssistance isCollapsible={state === 'collapsed'}/>
        </SidebarFooter>
    )
}