'use client'

import {DoorOpen} from "lucide-react";
import {WarningDialog} from "@/components/common/WarningDialog";
import {toast} from "sonner";
import {UserDialogTrigger} from "@/app/(home)/components/user_dialog/UserDialogTrigger";

export const LogoutDialog = () => {
    const item = {
        icon: <DoorOpen/>,
        title: 'Logout',
    }

    return (
        <WarningDialog trigger={<UserDialogTrigger item={item}/>}
                       title={'Are you sure you want to logout?'}
                       description={'This action will log you out of your current session.'}
                       onContinueAction={onContinue}
                       onCancelAction={onCancel}/>

    )
}

const onCancel = () => {
    toast.info('Logout canceled', {duration: 2000});
}

const onContinue = () => {
    toast.success('Logged out successfully', {duration: 2000});
}



