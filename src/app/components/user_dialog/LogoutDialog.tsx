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

export const LogoutDialog = () => {
    const item = {
        icon: <DoorOpen/>,
        title: 'Logout',
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
                        Are you sure you want to logout
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will log you out of your current session.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onContinue}>
                        Logout
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}





