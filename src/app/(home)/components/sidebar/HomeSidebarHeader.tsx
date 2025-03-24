import {SidebarHeader} from "@/components/ui/sidebar";
import Logo from "../../../../../public/images/share/Logo";
import Link from "next/link";
import {ModeToggle} from "@/components/common/ModeToggle";

export const HomeSidebarHeader = () => {
    return (
        <SidebarHeader>
            <div className={'flex items-center justify-between'}>
                <Link href={'/'} className={'flex items-center'}>
                    <Logo className={'size-10'}/>
                </Link>

                <Link href={'/'} className={'flex items-center'}>
                    <span className={'font-bold text-xl'}>Horizon</span>
                </Link>

                <ModeToggle/>
            </div>
        </SidebarHeader>
    )
}