'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileType, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DropzoneProps {
  onFileAdded: (file: File | null) => void
  className?: string
}

const MAX_SIZE = 64 * 1024 * 1024 // 64MB
const ACCEPTED_FILE_TYPES = ['.ttf']

export function Dropzone({ onFileAdded, className }: DropzoneProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const newFile = acceptedFiles[0]
        setFile(newFile)
        onFileAdded(newFile)
        setError(null)
      }
    },
    [onFileAdded]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_SIZE,
    accept: { 'font/ttf': ACCEPTED_FILE_TYPES },
    maxFiles: 1,
    multiple: false,
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0]
      if (rejection.errors[0].code === 'file-too-large') {
        setError('File is too large. Maximum size is 64MB.')
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Invalid file type. Only .ttf files are accepted.')
      } else {
        setError('Error uploading file. Please try again.')
      }
    },
  })

  const removeFile = () => {
    setFile(null)
    onFileAdded(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }

  return (
    <div className={cn("w-[350px] h-[180px] select-none", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "w-full h-full flex items-center justify-center",
          "border-2 border-dashed rounded-lg p-6 transition-colors",
          "hover:border-primary/50 hover:bg-muted/50 hover:cursor-pointer",
          {
            "border-primary/50 bg-muted/50": isDragActive,
            "border-input": !isDragActive,
          }
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          {file ? (
            <>
              <FileType className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-muted-foreground mb-1 truncate max-w-full">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
              >
                <X className="h-4 w-4 mr-2 text-red-700 dark:text-red-400" />
                Remove file
              </Button>
            </>
          ) : (
            <>
              <FileType className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">
                Drag & drop a TTF file here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                (Only .ttf files, up to 64MB)
              </p>
            </>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
