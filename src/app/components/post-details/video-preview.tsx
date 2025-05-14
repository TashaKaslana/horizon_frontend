"use client"

import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {FileVideo, X} from "lucide-react"
import {Post} from "@/types/Post"
import {formatDateDifference, formatDateTS} from "@/lib/utils";
import {Suspense} from "react";
import {Spinner} from "@/components/ui/spinner";

interface VideoPreviewProps {
    file?: File
    previewUrl?: string | null
    onResetAction: () => void
    existingData?: Post
    mode: "edit" | "create"
}

export function VideoPreview({file, previewUrl, onResetAction, mode, existingData}: VideoPreviewProps) {
    if (mode === "create" && file) {
        return fileVersion({file, previewUrl, onResetAction})
    } else if (mode === "edit" && existingData) {
        return existingDataVersion({existingData, onResetAction})
    }
}

const fileVersion = ({file, previewUrl, onResetAction}: {
    file: File
    previewUrl?: string | null
    onResetAction: () => void
}) => {
    return (
        <>
            <div
                className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-lg border border-black/10">
                {previewUrl && <video src={previewUrl} className="w-full h-full object-contain" controls/>}
                <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-3 right-3 rounded-full opacity-90 hover:opacity-100"
                    onClick={onResetAction}
                >
                    <X className="h-4 w-4"/>
                </Button>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                    <FileVideo className="h-5 w-5 text-primary"/>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                        • {new Date(file.lastModified).toLocaleDateString()}
                    </p>
                </div>
                <Badge variant="outline" className="ml-auto">
                    {file.type.split("/")[1].toUpperCase()}
                </Badge>
            </div>
        </>
    )
}

const existingDataVersion = ({existingData, onResetAction}: {
    existingData: Post
    onResetAction: () => void
}) => {
    return (
        <>
            <div
                className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-lg border border-black/10">
                <Suspense fallback={<Spinner/>}>
                    <video src={existingData.videoPlaybackUrl} className="w-full h-full object-contain" controls/>
                </Suspense>
                <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-3 right-3 rounded-full opacity-90 hover:opacity-100"
                    onClick={onResetAction}
                >
                    <X className="h-4 w-4"/>
                </Button>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                    <FileVideo className="h-5 w-5 text-primary"/>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{existingData.videoAsset.originalFilename}</p>
                    <p className="text-xs text-muted-foreground">
                        {(existingData.videoAsset.bytes / (1024 * 1024)).toFixed(2)} MB
                    </p>
                </div>
                <Badge variant="outline" className="ml-auto">
                    {existingData.videoAsset.format}
                </Badge>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center gap-3">
                <p>Post created: {formatDateTS(new Date(existingData.createdAt))}</p>
                <p>Last post updated: {formatDateDifference(new Date(existingData.updatedAt))}</p>
            </div>
        </>
    )
}


