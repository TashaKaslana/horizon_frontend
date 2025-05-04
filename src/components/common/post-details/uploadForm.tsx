import React, {SetStateAction, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";

import {uploadSchema} from "@/app/(home)/uploads/schemas/schema";
import uploadVideo from "@/app/(home)/uploads/libs/uploadVideo";

import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {VideoPreview} from "@/components/common/post-details/video-preview";
import {VideoDetailsForm} from "@/components/common/post-details/video-details-form";
import {UploadProgress} from "@/components/common/post-details/upload-progress";
import {toast} from "sonner";
import {PostUpload} from "@/app/(home)/uploads/types/postUpload";
import {cn} from "@/lib/utils";
import {Post, PostVisibility} from "@/types/Post";
import {updatePost} from "@/api/postApi";

export const UploadForm = ({
                               file,
                               previewUrl,
                               setFile,
                               setPreview,
                               setError,
                               mode,
                               existingData
                           }: {
        file?: File;
        previewUrl?: string | null;
        setFile?: React.Dispatch<SetStateAction<File | null>>;
        setPreview?: React.Dispatch<SetStateAction<string | null>>;
        setError?: React.Dispatch<SetStateAction<string | null>>;
        existingData?: Post;
        mode: "create" | "edit",
    }) => {
        const [uploadProgress, setUploadProgress] = useState(0);
        const [uploadComplete, setUploadComplete] = useState(false);

        const form = useForm({
            resolver: zodResolver(uploadSchema),
            defaultValues: resolveData({existingData, file}),
        });

        const resetUpload = () => {
            setFile?.(null);
            setPreview?.(null);
            setUploadProgress(0);
            setUploadComplete(false);
            setError?.(null);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };

        const mutation = useMutation({
                    mutationFn: async (postData: PostUpload) => {
                        if (mode === 'create') {
                            return await uploadVideo({
                                    postData,
                                    setUploadProgress
                                }
                            )
                        } else {
                            if (existingData === undefined) return;

                            return await updatePost(
                                existingData.id!,
                                {
                                    caption: postData.title,
                                    description: postData.description ?? "",
                                    visibility: postData.visibility as PostVisibility ?? "PUBLIC",
                                    categoryName: postData.category,
                                    //TODO: add tags
                                    tags: [],
                                    // allowComments: postData.allowComments,
                                    // ageRestricted: postData.ageRestricted,
                                })
                        }
                    },
                    onSuccess:
                        (data) => {
                            console.log("Upload successful", data);
                            setUploadProgress(100);
                            setUploadComplete(true);
                        },
                    onError:
                        (error) => {
                            console.error("Upload failed", error);
                            setError?.("Upload failed. Please try again.");
                            toast.error("Upload failed. Please try again.", {
                                duration: 10000,
                            });
                            setUploadProgress(0);
                        },
                }
            )
        ;

        useEffect(() => {
            if (existingData) {
                form.reset(resolveData({existingData}));
            }
        }, [existingData, form]);

        const handleUpload = async (data: z.infer<typeof uploadSchema>) => {
            if (mode === "create") {
                if (data.file === undefined) return;
                const duration = await getMediaDuration(data.file);

                mutation.mutate({...data, duration, file: data.file!});
            } else {
                mutation.mutate({...data, duration: existingData?.duration ?? 0, file:data.file!});
            }
        };

        const isUploading = mutation.isPending;

        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpload)} className="p-6 space-y-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-2/5 space-y-4">
                            <VideoPreview
                                file={file}
                                previewUrl={previewUrl}
                                onResetAction={resetUpload}
                                existingData={existingData}
                                mode={mode}/>
                        </div>

                        <div className="w-full lg:w-3/5">
                            <VideoDetailsForm form={form}/>
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
    }
;

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

const resolveData = ({existingData, file}: { existingData?: Post, file?: File }) => {
    if (file) {
        console.log("run this create")
        return {
            title: "",
            description: "",
            visibility: "PUBLIC" as const as PostVisibility,
            category: "",
            allowComments: true,
            ageRestricted: false,
            file: file,
        }
    } else if (existingData) {
        console.log("run this edit")
        return {
            title: existingData.caption,
            description: existingData.description,
            visibility: existingData.visibility,
            category: existingData.categoryName,
            allowComments: /*existingData.allowComments*/ true,
            ageRestricted: /*existingData.ageRestricted*/ false,
            file: undefined,
        }
    }
}
