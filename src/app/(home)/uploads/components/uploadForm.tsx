import {VideoPreview} from "@/app/(home)/uploads/components/video-preview";
import {VideoDetailsForm} from "@/app/(home)/uploads/components/video-details-form";
import {UploadProgress} from "@/app/(home)/uploads/components/upload-progress";
import React, {SetStateAction, useState} from "react";
import {z} from "zod";
import {uploadSchema} from "@/app/(home)/uploads/schemas/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";

export const UploadForm = (props: {
    file: File,
    previewUrl: string | null,
    setFile: React.Dispatch<SetStateAction<File | null>>,
    setPreview: React.Dispatch<SetStateAction<string | null>>,
    setError: React.Dispatch<SetStateAction<string | null>>
}) => {
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadComplete, setUploadComplete] = useState(false)

    const form = useForm({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            title: "",
            description: "",
            visibility: "private",
            category: "",
            allowComments: true,
            ageRestricted: false,
            file: props.file,
        },
    })

    const resetUpload = () => {
        props.setFile(null)
        props.setPreview(null)
        setUploadProgress(0)
        setIsUploading(false)
        setUploadComplete(false)
        props.setError(null)
        if (props.previewUrl) URL.revokeObjectURL(props.previewUrl)
    }

    const handleUpload = (data: z.infer<typeof uploadSchema>) => {
        if (!props.file) return

        console.log(data)

        setIsUploading(true)
        setUploadProgress(0)

        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsUploading(false)
                    setUploadComplete(true)
                    return 100
                }
                return prev + 5
            })
        }, 200)
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpload)} className="p-6 space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/5 space-y-4">
                    <VideoPreview file={props.file} previewUrl={props.previewUrl} onResetAction={resetUpload}/>
                </div>

                <div className="w-full lg:w-3/5">
                    <VideoDetailsForm form={form}/>
                </div>
            </div>

            <UploadProgress isUploading={isUploading} uploadComplete={uploadComplete} progress={uploadProgress}/>

            <div className="flex justify-end gap-4 pt-2">
                <Button
                    type="button"
                    onClick={resetUpload}
                    className="inline-flex items-center justify-center rounded-md text-black text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
                >
                    {uploadComplete ? 'Go Back' : 'Cancel'}
                </Button>
                <Button
                    type="submit"
                    disabled={isUploading || uploadComplete}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8"
                >
                    {isUploading ? "Uploading..." : uploadComplete ? "Uploaded" : "Upload Video"}
                </Button>
            </div>
        </form>
    </Form>;
}