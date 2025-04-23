import React, { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { uploadSchema } from "@/app/(home)/uploads/schemas/schema";
import uploadVideo from "@/app/(home)/uploads/libs/uploadVideo";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { VideoPreview } from "@/app/(home)/uploads/components/video-preview";
import { VideoDetailsForm } from "@/app/(home)/uploads/components/video-details-form";
import { UploadProgress } from "@/app/(home)/uploads/components/upload-progress";
import {toast} from "sonner";
import {PostUpload} from "@/app/(home)/uploads/types/postUpload";
import {cn} from "@/lib/utils";

export const UploadForm = ({
                               file,
                               previewUrl,
                               setFile,
                               setPreview,
                               setError,
                           }: {
    file: File;
    previewUrl: string | null;
    setFile: React.Dispatch<SetStateAction<File | null>>;
    setPreview: React.Dispatch<SetStateAction<string | null>>;
    setError: React.Dispatch<SetStateAction<string | null>>;
}) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadComplete, setUploadComplete] = useState(false);

    const form = useForm({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            title: "",
            description: "",
            visibility: "PUBLIC",
            category: "",
            allowComments: true,
            ageRestricted: false,
            file: file,
        },
    });

    const resetUpload = () => {
        setFile(null);
        setPreview(null);
        setUploadProgress(0);
        setUploadComplete(false);
        setError(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
    };

    const mutation = useMutation({
        mutationFn: (postData: PostUpload) =>
            uploadVideo({
                postData,
                setUploadProgress
            }),
        onSuccess: (data) => {
            console.log("Upload successful", data);
            setUploadProgress(100);
            setUploadComplete(true);
        },
        onError: (error) => {
            console.error("Upload failed", error);
            setError("Upload failed. Please try again.");
            toast.error("Upload failed. Please try again.", {
                duration: 10000,
            });
            setUploadProgress(0);
        },
    });

    const handleUpload = async (data: z.infer<typeof uploadSchema>) => {
        if (!file) return;
        const duration = await getMediaDuration(file);

        mutation.mutate({...data, duration});
    };

    const isUploading = mutation.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpload)} className="p-6 space-y-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-2/5 space-y-4">
                        <VideoPreview file={file} previewUrl={previewUrl} onResetAction={resetUpload} />
                    </div>

                    <div className="w-full lg:w-3/5">
                        <VideoDetailsForm form={form} />
                    </div>
                </div>

                <UploadProgress
                    isUploading={isUploading}
                    uploadComplete={uploadComplete}
                    progress={uploadProgress}
                />

                <div className="flex justify-end gap-4 pt-2">
                    <Button
                        type="button"
                        onClick={resetUpload}
                        className={cn("border bg-background text-muted-foreground hover:bg-accent h-10 px-6",
                                uploadComplete && "text-black dark:text-white"
                            )}
                    >
                        {uploadComplete ? "Go Back" : "Cancel"}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isUploading || uploadComplete}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8"
                    >
                        {isUploading ? "Uploading..." : uploadComplete ? "Uploaded" : "Upload Video"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

const getMediaDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const video = document.createElement('video');

        video.preload = 'metadata';
        video.src = url;

        video.onloadedmetadata = () => {
            URL.revokeObjectURL(url);
            resolve(video.duration);
        };

        video.onerror = () => {
            reject(new Error("Failed to load video metadata"));
        };
    });
};
