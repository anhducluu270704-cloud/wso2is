'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

const COPY_KEYS = {
  error: 'copy.error',
} as const

export type UseCopyActions = {
  copy: (text: string) => Promise<boolean>
  /** Tăng sau mỗi lần copy thành công; truyền cùng `copy` xuống `ReadOnlyInputField` để ẩn banner ở ô khác. */
  copyNonce: number
}

export function useCopy() {
  const t = useTranslations('common')
  const error = t(COPY_KEYS.error)
  const [copyNonce, setCopyNonce] = useState(0)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopyNonce((n) => n + 1)
        return true
      } catch {
        toast.error(error)
        return false
      }
    },
    [error]
  )

  return { copy, copyNonce }
}
