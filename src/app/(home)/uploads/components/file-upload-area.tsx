"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FileVideo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadAreaProps {
  onFileSelectedAction: (file: File) => void
  error: string | null
}

export function FileUploadArea({ onFileSelectedAction, error }: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelectedAction(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelectedAction(e.target.files[0])
    }
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300",
        isDragging
          ? "border-primary bg-primary/10 scale-[0.99]"
          : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*" />
      <div className="relative mx-auto w-24 h-24 mb-6">
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FileVideo className="h-12 w-12 text-primary" />
        </div>
      </div>

      <h3 className="text-xl font-medium mb-2">Drag and drop video files</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        Your videos will be private until you publish them. Supported formats: MP4, MOV, AVI, etc.
      </p>

      <Button type="button" size="lg" className="rounded-full px-8 font-medium">
        SELECT FILES
      </Button>

      {error && (
        <div className="mt-6 text-red-500 flex items-center justify-center gap-2 bg-red-50 p-3 rounded-lg max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

