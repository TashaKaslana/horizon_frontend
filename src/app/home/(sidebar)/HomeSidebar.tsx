import {Sidebar,} from "@/components/ui/sidebar";
import {HomeSidebarHeader} from "@/app/home/(sidebar)/HomeSidebarHeader";
import {HomeSidebarContent} from "@/app/home/(sidebar)/HomeSidebarContent";
import {HomeSidebarFooter} from "@/app/home/(sidebar)/HomeSidebarFooter";

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