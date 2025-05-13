import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {ChangeEvent, useEffect, useState} from "react";
import {CameraIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import Image from "next/image"
import {ImagePreviewDialog} from "@/app/components/avatar_upload/image-preview-dialog";
import {useUploadUserImage} from "@/app/components/avatar_upload/useUploadUserImage";
import {Spinner} from "@/components/ui/spinner";

interface ImageUploadProps {
    placeholder?: string;
    imageUrl?: string;
    variant: 'avatar' | 'cover';
}

export const ImageUpload = ({placeholder, imageUrl, variant}: ImageUploadProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>( null);
    const [file, setFile] = useState<File | null>(null);
    const [isPreview, setIsPreview] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (!isPreview && imageUrl) {
            setPreviewUrl(imageUrl);
        }
    }, [imageUrl, isPreview]);

    const isAvatar = variant === 'avatar';

    const {mutate: uploadImage, isPending} = useUploadUserImage();

    const handleUpload = (file: File, type: 'profileImage' | 'coverPhoto') => {
        uploadImage({
            file,
            type,
            setProgress: (p) => {
                console.log(`Upload progress: ${p}%`);
            },
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsPreview(true);
            setFile(file)
        }
    };

    const handleCancel = () => {
        setPreviewUrl(imageUrl ?? null);
        setIsPreview(false);
    };

    const handleConfirm = () => {
        if (file) {
            handleUpload(file, variant === 'avatar' ? 'profileImage' : 'coverPhoto')
        }
    };

    return (
        <div className="relative">
            {isAvatar ? (
                <Avatar className="size-40">
                    <AvatarImage src={previewUrl ?? undefined}
                                 alt={placeholder ?? 'user'}
                                 loading="eager"
                    />
                    <AvatarFallback>{placeholder ?? 'user'}</AvatarFallback>
                </Avatar>
            ) : (
                <div className="w-full h-40 rounded-md overflow-hidden border">
                    {previewUrl ? (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            <Image
                                src={previewUrl}
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
            )}

            <div className="absolute bottom-1 right-1 bg-white/50 border rounded-full p-1 z-10 cursor-pointer">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ImagePreviewDialog
                                variant={variant}
                                imageUrl={previewUrl ?? ''}
                                isOpen={isDialogOpen}
                                setIsOpen={setIsDialogOpen}
                                onSubmit={handleConfirm}
                                onCancel={handleCancel}
                            >
                                <span className="relative cursor-pointer">
                                    <CameraIcon className={cn(isPreview && 'border-sky-500')}/>
                                    <Input
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChange}
                                    />
                                </span>
                            </ImagePreviewDialog>
                        </TooltipTrigger>
                        <TooltipContent>Click to change {variant}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {isPending && <div className={'w-full'}><Spinner/></div>}
            </div>
        </div>
    );
};
