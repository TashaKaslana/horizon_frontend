import {SidebarFooter} from "@/components/ui/sidebar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Separator} from "@/components/ui/separator";
import {LogoutDialog} from "@/app/(home)/components/user_dialog/LogoutDialog";
import {ProfileDialog} from "@/app/(home)/components/user_dialog/ProfileDialog";
import {UserInformation} from "@/components/common/UserInformation";

export const HomeSidebarFooter = () => {
    return (
        <SidebarFooter>
            <Popover>
                <PopoverTrigger asChild>
                   <UserInformation/>
                </PopoverTrigger>
                <PopoverContent className={'space-y-2 p-1'}>
                    <UserInformation className={'w-full'}/>

                    <Separator/>

                    <div className={'flex flex-col place-content-start'}>
                        <ProfileDialog/>
                        <LogoutDialog/>
                    </div>
                </PopoverContent>
            </Popover>
        </SidebarFooter>
    )
}