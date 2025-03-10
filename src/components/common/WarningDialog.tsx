'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import React, {ReactNode} from "react";
import {Button} from "@/components/ui/button";

type WarningDialogProps = {
    trigger: ReactNode,
    title: string,
    description: string,
    onContinueAction: () => void,
    onCancelAction: () => void,
}

export const WarningDialog = ({trigger, title, description, onContinueAction, onCancelAction}: WarningDialogProps) => {
    const [open, setOpen] = React.useState(false);

    const handleCancel = () => {
        onCancelAction();
        setOpen(false);
    }

    const handleContinue = () => {
        onContinueAction()
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                {trigger}
            </DialogTrigger>
            <DialogContent className={'bg-gray-100'}>
                <DialogHeader>
                    <DialogTitle className={'text-orange-600'}>
                        {title}
                    </DialogTitle>
                    <DialogDescription className={'text-orange-400'}>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <section className={'w-full flex justify-between'}>
                    <Button onClick={handleCancel} className={'bg-red-500 hover:bg-red-400'}>
                        Cancel
                    </Button>
                    <Button onClick={handleContinue} className={'bg-sky-500 hover:bg-sky-400'}>
                        Continue
                    </Button>
                </section>
            </DialogContent>
        </Dialog>
    )
}