"use client"

import type React from "react"
import { FileVideo, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

interface FileUploadAreaProps {
  error: string | null
}

export function FileUploadArea({ error }: FileUploadAreaProps) {
  const t = useTranslations('Home.upload.dropzone');

  return (
    <div>
      <div className="relative mx-auto w-24 h-24 mb-6">
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FileVideo className="h-12 w-12 text-primary" />
        </div>
      </div>

      <h3 className="text-xl font-medium mb-2">{t('title')}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        {t('description')}
        <br />
        {t('supportedFormats')}
        <br />
        {t('maxSize')}
      </p>

      <Button type="button" size="lg" className="rounded-full px-8 font-medium pointer-events-none">
        {t('description')}
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