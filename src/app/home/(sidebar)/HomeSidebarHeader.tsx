import {SidebarHeader} from "@/components/ui/sidebar";
import Logo from "../../../../public/images/share/Logo";

export const HomeSidebarHeader = () => {
    return (
        <SidebarHeader>
            <div className={'flex items-center gap-8'}>
                <Logo className={'size-10'}/>
                <span className={'font-bold text-xl'}>Horizon</span>
            </div>
        </SidebarHeader>
    )
}