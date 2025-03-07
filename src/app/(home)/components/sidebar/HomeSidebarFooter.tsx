import {SidebarFooter} from "@/components/ui/sidebar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {navigationUserData} from "@/app/(home)/constraints/navigation_data";

export const HomeSidebarFooter = () => {
    return (
        <SidebarFooter>
            <Popover>
                <PopoverTrigger asChild>
                    <div className={'flex gap-2 items-center hover:bg-gray-300 p-1 rounded cursor-pointer select-none'}>
                        <UserInformation/>
                    </div>
                </PopoverTrigger>
                <PopoverContent className={'space-y-2 p-1'}>
                    <div className={'flex gap-2 items-center px-1 pt-1'}>
                        <UserInformation/>
                    </div>

                    <Separator/>

                    <div className={'flex flex-col place-content-start'}>
                        {navigationUserData.map((item, index) =>
                            <Link key={index}
                                  href={item.href}
                                  className={'group box-border flex p-1 gap-2 justify-start border border-transparent ' +
                                      'hover:border-gray-300 items-center transition-colors duration-500 rounded'}
                            >
                                <span
                                    className={'text-zinc-500 group-hover:text-black transition-colors duration-500'}>{item.icon}</span>
                                <p className={'text-sm font-extralight'}>{item.title}</p>
                            </Link>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </SidebarFooter>
    )
}

const UserInformation = () => {
    return (
        <>
            <div className={'size-8 rounded bg-purple-500'}/>
            <div>
                <h1 className={'font-bold text-md'}>UserDisplay</h1>
                <p className={'font-extralight text-xs italic text-zinc-600'}>@Username</p>
            </div>
        </>
    )
}