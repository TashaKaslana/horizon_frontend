'use client'

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {UserInformation} from "@/components/common/UserInformation";
import {Separator} from "@/components/ui/separator";
import {HistoryDialog} from "@/app/components/user_dialog/HistoryDialog";
import {SettingDialog} from "@/app/components/user_dialog/SettingDialog";
import {LogoutDialog} from "@/app/components/user_dialog/LogoutDialog";
import Link from "next/link";
import {useCurrentUser} from "@/stores/useCurrentUser";
import {SquareUserRound} from "lucide-react";
import {UserDialogTrigger} from "@/app/components/user_dialog/UserDialogTrigger";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export const UserAssistance = ({isCollapsible}: { isCollapsible?: boolean }) => {
    const {user} = useCurrentUser()

    return (
        <Popover>
            <PopoverTrigger className={'w-full'}>
                {isCollapsible ?(
                    <Avatar className={'w-full'}>
                        <AvatarImage src={user?.profileImage}/>
                        <AvatarFallback>{user?.displayName[0]}</AvatarFallback>
                    </Avatar>
                ) : (
                    <div className={'w-full'}>
                        <UserInformation/>
                    </div>
                )}
            </PopoverTrigger>
            <PopoverContent className={'space-y-2 p-1'}>
                <UserInformation className={'w-full'}/>

                <Separator/>

                <div className={'flex flex-col place-content-start'}>
                    <HistoryDialog/>
                    {/*<ProfileDialog/>*/}
                    <Link href={`/users/${user?.id}/overview`}>
                        <UserDialogTrigger item={{icon: <SquareUserRound/>, title: 'Profile'}}/>
                    </Link>
                    <SettingDialog/>
                    <LogoutDialog/>
                </div>
            </PopoverContent>
        </Popover>
    )
}