import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {UserDialogTrigger} from "@/components/common/user_dialog/UserDialogTrigger";
import {Settings} from "lucide-react";
import SettingsContainer from "@/components/common/user_dialog/settings/SettingsContainer";

export const SettingDialog = () => {
    const trigger = {
        icon: <Settings/>,
        title: 'Settings',
    };

    return (
        <Dialog>
            <DialogTrigger>
                <UserDialogTrigger item={trigger}/>
            </DialogTrigger>
            <DialogContent className={'!max-w-fit h-[500px]'}>
                <DialogTitle className="sr-only">Settings</DialogTitle>
                <DialogDescription className="sr-only">
                    Customize your settings here.
                </DialogDescription>

                <SettingsContainer/>
            </DialogContent>
        </Dialog>
    )
}
