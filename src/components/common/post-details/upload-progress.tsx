"use client"

import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"

interface UploadProgressProps {
  isUploading: boolean
  uploadComplete: boolean
  progress: number
}

export function UploadProgress({ isUploading, uploadComplete, progress }: UploadProgressProps) {
  if (!isUploading && !uploadComplete) return null

  return (
    <>
      {isUploading && (
        <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Uploading your video...</span>
            <span className="text-primary font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {uploadComplete && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3 animate-in fade-in">
          <div className="bg-green-100 p-1 rounded-full">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Upload complete!</p>
            <p className="text-sm text-green-600">Your video is now processing and will be available soon.</p>
          </div>
        </div>
      )}
    </>
  )
}

