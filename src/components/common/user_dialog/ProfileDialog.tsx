'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {UserDialogTrigger} from "@/components/common/user_dialog/UserDialogTrigger";
import {SquareUserRound} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Button} from "@/components/ui/button";
import {UserInformation} from "@/components/common/UserInformation";
import {ProfileInformationForm} from "@/components/common/user_dialog/profile/ProfileInformationForm";
import {useState} from "react";

export const ProfileDialog = () => {
    const item = {icon: <SquareUserRound/>, title: 'Profile'};
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditToggle = () => {
        setIsEditing(prevState => !prevState);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <UserDialogTrigger item={item}/>
            </DialogTrigger>
            <DialogContent className={'!max-w-fit h-[600px] flex flex-col bg-gray-100'}>
                <DialogHeader>
                    <DialogTitle>Profile</DialogTitle>
                    <DialogDescription>Your information is displaying here</DialogDescription>
                </DialogHeader>
                <ScrollArea className={'flex-1 h-full overflow-y-auto'}>
                    <section className={'w-[800px] space-y-2 px-3'}>
                        <header
                            className={'h-16 w-full rounded-xl bg-gradient-to-r from-indigo-400 via-red-300 to-cyan-400'}/>
                        <div className={'flex justify-between items-center w-full hover:bg-gray-300 rounded-lg'}>
                            <UserInformation className={''}/>
                            <Button className={'mr-1 bg-sky-500 hover:bg-sky-400 w-24'} onClick={handleEditToggle}>Edit</Button>
                        </div>
                        <ProfileInformationForm isEditing={isEditing}/>
                    </section>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}


