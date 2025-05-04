"use client"

import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {FileVideo, X} from "lucide-react"
import {PostSummary} from "@/types/Post"

interface VideoPreviewProps {
    file?: File
    previewUrl: string | null
    onResetAction: () => void
    existingData?: PostSummary
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
    previewUrl: string | null
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
    existingData: PostSummary
    onResetAction: () => void
}) => {
    return (
        <>
            <div
                className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-lg border border-black/10">
                {existingData.videoPlaybackUrl && <video src={existingData.videoPlaybackUrl} className="w-full h-full object-contain" controls/>}
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
                    <p className="text-xs text-muted-foreground">
                        {new Date(existingData.updatedAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </>
    )
}


