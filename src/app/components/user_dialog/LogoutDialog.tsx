'use client'

import {DoorOpen} from "lucide-react";
import {toast} from "sonner";
import {UserDialogTrigger} from "@/app/components/user_dialog/UserDialogTrigger";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const LogoutDialog = () => {
    const t = useTranslations("Home.user_dialog");

    const item = {
        icon: <DoorOpen/>,
        title: t('logout'),
    }
    const router = useRouter();

    const onCancel = () => {
        toast.info('Logout canceled', {duration: 2000});
    }

    const onContinue = () => {
        router.push("/auth/logout");
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <UserDialogTrigger item={item}/>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t("confirm_logout")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("logout_description") || "This action will log you out of your current session."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        {t("no")}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onContinue}>
                        {t("yes")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
