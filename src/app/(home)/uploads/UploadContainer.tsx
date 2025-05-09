"use client"

import type React from "react"
import {useState} from "react"
import {Video} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card"
import {FileUploadArea} from "@/app/(home)/uploads/components/file-upload-area";
import {UploadForm} from "@/app/(home)/uploads/components/uploadForm";

export default function UploadContainer() {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleFileSelected = (selectedFile: File) => {
        if (!selectedFile.type.startsWith("video/")) {
            setError("Please select a video file")
            return
        }

        setError(null)
        setFile(selectedFile)

        const url = URL.createObjectURL(selectedFile)
        setPreview(url)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex justify-center">
            <div className="container max-w-5xl py-12">
                <header className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                        <Video className="h-6 w-6 text-primary"/>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Upload your video</h1>
                    <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                        Share your story with the world. Upload a video to get started.
                    </p>
                </header>

                <Card className="border-none shadow-lg">
                    <CardContent className="p-0">
                        <div className="space-y-8">
                            {!file ? (
                                <FileUploadArea onFileSelectedAction={handleFileSelected} error={error}/>
                            ) : (
                                <UploadForm file={file}
                                            previewUrl={preview}
                                            setFile={setFile}
                                            setPreview={setPreview}
                                            setError={setError}
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

