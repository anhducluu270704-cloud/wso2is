'use client'

import {
  FALLBACK_TOAST_DURATION_MS,
  TOAST_EXIT_ANIMATION_MS,
} from '@/constants/application'
import { useCallback, useEffect, useState } from 'react'

export type InlineToast = {
  type: 'success' | 'error' | 'warning'
  message: string
  durationMs?: number
}

type ToastOptions = {
  durationMs?: number
}

export function useInlineToast() {
  const [inlineToast, setInlineToast] = useState<InlineToast | null>(null)
  const [isToastExiting, setIsToastExiting] = useState(false)

  useEffect(() => {
    if (!inlineToast) return
    const duration = inlineToast.durationMs ?? FALLBACK_TOAST_DURATION_MS
    const id = setTimeout(() => setIsToastExiting(true), duration)
    return () => clearTimeout(id)
  }, [inlineToast])

  useEffect(() => {
    if (!isToastExiting || !inlineToast) return
    const id = setTimeout(() => {
      setInlineToast(null)
      setIsToastExiting(false)
    }, TOAST_EXIT_ANIMATION_MS)
    return () => clearTimeout(id)
  }, [inlineToast, isToastExiting])

  const showToast = useCallback(
    (type: InlineToast['type'], message: string, options?: ToastOptions) => {
      setIsToastExiting(false)
      setInlineToast({
        type,
        message,
        durationMs: options?.durationMs,
      })
    },
    []
  )

  const showSuccess = useCallback(
    (message: string, options?: ToastOptions) =>
      showToast('success', message, options),
    [showToast]
  )

  const showError = useCallback(
    (message: string, options?: ToastOptions) =>
      showToast('error', message, options),
    [showToast]
  )

  const showWarning = useCallback(
    (message: string, options?: ToastOptions) =>
      showToast('warning', message, options),
    [showToast]
  )

  const dismissToast = useCallback(() => {
    if (!inlineToast) return
    setIsToastExiting(true)
  }, [inlineToast])

  return {
    inlineToast,
    isToastExiting,
    showSuccess,
    showError,
    showWarning,
    dismissToast,
  }
}
