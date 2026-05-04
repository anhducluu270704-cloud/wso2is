'use client'

import { DeleteIcon, FileUploadIcon } from '@/share/icons'
import { cn } from '@/share/lib/utils'
import { Button } from '@/share/ui/button'
import { formatFileSize } from '@/util/file-size'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import { toast } from 'sonner'

type UploadFileProps = {
  onFilesChange?: (files: File[]) => void
  maxFileBytes?: number
  validateFile?: (file: File) => boolean
  maxFiles?: number
  acceptedTypes?: string
  multiple?: boolean
  className?: string
}

type ListedFile = { id: string; file: File }

const UploadFile: React.FC<UploadFileProps> = ({
  onFilesChange,
  maxFileBytes,
  validateFile,
  maxFiles = 5,
  acceptedTypes = '*',
  multiple = false,
  className,
}) => {
  const t = useTranslations('common')

  const [files, setFiles] = useState<ListedFile[]>([])
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleChange = (e: File | File[]) => {
    const seen = new Set<string>()
    const incomingFiles = Array.isArray(e) ? e : [e]
    let merged: ListedFile[]

    if (multiple) {
      merged = [
        ...files,
        ...incomingFiles.map((file) => ({
          id: crypto.randomUUID(),
          file,
        })),
      ]
    } else {
      merged = incomingFiles
        .filter((f) => {
          const key = `${f.name}_${f.size}_${f.lastModified}`
          if (seen.has(key)) {
            toast.info(
              t('upload_file.toast.duplicate_skip', { name: f.name })
            )
            return false
          }
          seen.add(key)
          return true
        })
        .slice(0, 1)
        .map((file) => ({ id: crypto.randomUUID(), file }))
    }

    if (merged.length > maxFiles) {
      toast.error(
        t('upload_file.toast.max_files', { maxFiles, count: merged.length })
      )
    }
    const total = merged.slice(0, maxFiles)

    if (maxFileBytes != null) {
      for (const { file: f } of total) {
        if (f.size > maxFileBytes) {
          setValidationError(t('upload_file.error.max_file_size'))
          return
        }
      }
    }

    if (validateFile && total.some(({ file: f }) => !validateFile(f))) {
      return
    }

    setValidationError(null)
    setFiles(total)
    onFilesChange?.(total.map(({ file }) => file))
  }

  const removeFile = (id: string) => {
    const next = files.filter((x) => x.id !== id)
    setFiles(next)
    onFilesChange?.(next.map(({ file }) => file))
    if (next.length === 0) setValidationError(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={acceptedTypes === '*' ? undefined : acceptedTypes.split(',')}
        multiple={multiple}
      >
        <div
          className={cn(
            'w-full h-48 md:h-52 lg:h-56 bg-grey-12 rounded-md flex items-center justify-center cursor-pointer',
            className
          )}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 px-4 text-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.16957 1.25L15 1.25C15.1989 1.25 15.3897 1.32902 15.5303 1.46967L20.5303 6.46967C20.671 6.61032 20.75 6.80109 20.75 7V18.8305C20.75 19.3646 20.75 19.8104 20.7203 20.1747C20.6892 20.5546 20.6221 20.9112 20.4503 21.2485C20.1866 21.7659 19.7659 22.1866 19.2485 22.4503C18.9112 22.6221 18.5546 22.6892 18.1747 22.7203C17.8104 22.75 17.3646 22.75 16.8305 22.75H7.16955C6.6354 22.75 6.18956 22.75 5.82533 22.7203C5.44545 22.6892 5.08879 22.6221 4.75153 22.4503C4.23408 22.1866 3.81339 21.7659 3.54973 21.2485C3.37789 20.9112 3.31078 20.5546 3.27974 20.1747C3.24998 19.8104 3.24999 19.3646 3.25 18.8304V5.16957C3.24999 4.63541 3.24998 4.18956 3.27974 3.82533C3.31078 3.44545 3.37789 3.08879 3.54973 2.75153C3.81338 2.23408 4.23408 1.81338 4.75153 1.54973C5.08879 1.37789 5.44545 1.31078 5.82533 1.27974C6.18956 1.24998 6.63541 1.24999 7.16957 1.25ZM5.94748 2.77476C5.66036 2.79822 5.52307 2.8401 5.43251 2.88624C5.19731 3.00608 5.00608 3.19731 4.88624 3.43251C4.8401 3.52307 4.79822 3.66036 4.77476 3.94748C4.75058 4.24336 4.75 4.62757 4.75 5.2V18.8C4.75 19.3724 4.75058 19.7566 4.77476 20.0525C4.79822 20.3396 4.8401 20.4769 4.88624 20.5675C5.00608 20.8027 5.19731 20.9939 5.43251 21.1138C5.52307 21.1599 5.66036 21.2018 5.94748 21.2252C6.24336 21.2494 6.62757 21.25 7.2 21.25H16.8C17.3724 21.25 17.7566 21.2494 18.0525 21.2252C18.3396 21.2018 18.4769 21.1599 18.5675 21.1138C18.8027 20.9939 18.9939 20.8027 19.1138 20.5675C19.1599 20.4769 19.2018 20.3396 19.2252 20.0525C19.2494 19.7566 19.25 19.3724 19.25 18.8V7.75L15.7798 7.75C15.6576 7.75003 15.5252 7.75006 15.4105 7.7407C15.2808 7.7301 15.1093 7.70386 14.9325 7.61376C14.6973 7.49392 14.5061 7.30269 14.3862 7.06749C14.2961 6.89066 14.2699 6.71923 14.2593 6.58947C14.2499 6.47483 14.25 6.34239 14.25 6.22023C14.25 6.21345 14.25 6.20671 14.25 6.2V2.75H7.2C6.62757 2.75 6.24336 2.75058 5.94748 2.77476ZM15.75 3.81066L18.1893 6.25H15.8C15.7824 6.25 15.7657 6.25 15.75 6.24999C15.75 6.23425 15.75 6.21764 15.75 6.2V3.81066ZM11.5199 8.67383C11.798 8.44206 12.202 8.44206 12.4801 8.67383L14.9801 10.7572C15.2983 11.0223 15.3413 11.4953 15.0762 11.8135C14.811 12.1317 14.3381 12.1747 14.0199 11.9095L12.75 10.8513V16.75C12.75 17.1642 12.4142 17.5 12 17.5C11.5858 17.5 11.25 17.1642 11.25 16.75V10.8513L9.98014 11.9095C9.66193 12.1747 9.18901 12.1317 8.92383 11.8135C8.65866 11.4953 8.70165 11.0223 9.01986 10.7572L11.5199 8.67383Z"
                fill="#1A1A1A"
              />
            </svg>
            <p className="m-0 inline-flex flex-wrap items-center justify-center gap-x-1.5 text-base leading-normal">
              <span className="font-bold text-blue-2 underline decoration-blue-2 decoration-2 underline-offset-2">
                {t('upload_file.drop_zone.upload_action')}
              </span>
              <span className="font-normal text-neutral-900">
                {t('upload_file.drop_zone.suffix')}
              </span>
            </p>
          </div>
        </div>
      </FileUploader>
      {validationError ? (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {validationError}
        </p>
      ) : null}
      {files.length > 0 && (
        <div>
          {files.map(({ id, file: f }) => (
            <div
              key={id}
              className="flex items-center justify-between gap-3 py-3 px-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileUploadIcon className="size-10 shrink-0" />
                <div className="flex min-w-0 flex-col gap-1 text-body-sm">
                  <span className="text-black-1 truncate">{f.name}</span>
                  <span className="text-grey-6 truncate">
                    {formatFileSize(f.size)}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-lg"
                onClick={() => removeFile(id)}
              >
                <DeleteIcon className="size-6 text-black-1" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UploadFile
