import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {UserDialogTrigger} from "@/app/components/user_dialog/UserDialogTrigger";
import {Settings} from "lucide-react";
import SettingsContainer from "@/app/components/user_dialog/settings/SettingsContainer";
import { useTranslations } from "next-intl";

export const SettingDialog = () => {
    const t = useTranslations("Home.user_dialog");
    const settingsT = useTranslations("Home.user_dialog.settings_dialog");

    const trigger = {
        icon: <Settings/>,
        title: t('settings'),
    };

    return (
        <Dialog>
            <DialogTrigger>
                <UserDialogTrigger item={trigger}/>
            </DialogTrigger>
            <DialogContent className={'!max-w-fit h-[500px]'}>
                <DialogTitle className="sr-only">{settingsT("title")}</DialogTitle>
                <DialogDescription className="sr-only">
                    {settingsT("description") || "Customize your settings here."}
                </DialogDescription>

                <SettingsContainer/>
            </DialogContent>
        </Dialog>
    )
}
