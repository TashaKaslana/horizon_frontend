import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import { Dispatch, ReactNode, SetStateAction } from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image"

interface ImagePreviewDialogProps {
    variant: 'avatar' | 'cover';
    children: ReactNode;
    imageUrl: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onSubmit: () => void;
    onCancel: () => void;
}

export const ImagePreviewDialog = ({
                                variant,
                                children,
                                imageUrl,
                                isOpen,
                                setIsOpen,
                                onSubmit,
                                onCancel,
                            }: ImagePreviewDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Preview Your New {variant === 'avatar' ? 'Avatar' : 'Cover Photo'}</DialogTitle>
                </DialogHeader>

                <div className="flex justify-center items-center my-4">
                    {imageUrl ? (
                        variant === 'avatar' ? (
                            <Avatar className="size-60">
                                <AvatarImage src={imageUrl} alt="Avatar Preview" />
                                <AvatarFallback>Image</AvatarFallback>
                            </Avatar>
                        ) : (
                            <div className="w-full h-40 rounded-md overflow-hidden border shadow">
                                {imageUrl ? (
                                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                        <Image
                                            src={imageUrl}
                                            alt="Cover Preview"
                                            className="object-cover"
                                            fill
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-64 flex items-center justify-center border rounded-lg text-gray-500">
                                        No image selected
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        <div className="w-40 h-40 flex items-center justify-center text-gray-500 border rounded">
                            No image selected
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => { onCancel(); setIsOpen(false); }}>
                        Cancel
                    </Button>
                    <Button onClick={() => { onSubmit(); setIsOpen(false); }}>
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
