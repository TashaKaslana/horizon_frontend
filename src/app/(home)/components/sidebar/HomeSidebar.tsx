import {Sidebar,} from "@/components/ui/sidebar";
import {HomeSidebarHeader} from "@/app/(home)/components/sidebar/HomeSidebarHeader";
import {HomeSidebarContent} from "@/app/(home)/components/sidebar/HomeSidebarContent";
import {HomeSidebarFooter} from "@/app/(home)/components/sidebar/HomeSidebarFooter";

const HomeSidebar = () => {
    return (
        <Sidebar>
            <HomeSidebarHeader/>
            <HomeSidebarContent/>
            <HomeSidebarFooter/>
        </Sidebar>
    )
}

export default HomeSidebar