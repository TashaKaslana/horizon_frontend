'use client'
import {SidebarHeader, SidebarMenu, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar";
import Logo from "../../../../../public/images/share/Logo";
import Link from "next/link";
import {ModeToggle} from "@/components/common/ModeToggle";

export const HomeSidebarHeader = () => {
    const {state} = useSidebar()

    return (
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="flex items-center justify-between w-full">
                        {state !== 'collapsed' && (
                            <>
                                <Link href="/" className="flex items-center">
                                    <Logo className="size-10"/>
                                </Link>

                                <Link href="/" className="flex items-center">
                                    <span className="font-bold text-xl">Horizon</span>
                                </Link>
                            </>
                            )
                        }

                        <ModeToggle/>
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
    );
};