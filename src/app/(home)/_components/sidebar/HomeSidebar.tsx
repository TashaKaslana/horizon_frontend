import {Sidebar,} from "@/components/ui/sidebar";
import {HomeSidebarHeader} from "@/app/(home)/_components/sidebar/HomeSidebarHeader";
import {HomeSidebarContent} from "@/app/(home)/_components/sidebar/HomeSidebarContent";
import {HomeSidebarFooter} from "@/app/(home)/_components/sidebar/HomeSidebarFooter";

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