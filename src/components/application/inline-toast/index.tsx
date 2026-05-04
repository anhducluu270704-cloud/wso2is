import { usePathname, useRouter } from '@/i18n/navigation'
import { useInlineToast } from '@/share/hooks/use-inline-toast'
import { ToastError, ToastInfo, ToastSuccess } from '@/share/icons'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export type InlineToast = {
  type: 'success' | 'error' | 'warning'
  message: string
  durationMs?: number
}

export function useApplicationInlineToast(
  inlinetoasttype: string,
  inlinetoastmsgkey: string
) {
  const t = useTranslations('application')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {
    inlineToast,
    isToastExiting,
    showSuccess,
    showError,
    showWarning,
    dismissToast,
  } = useInlineToast()

  useEffect(() => {
    if (!inlinetoasttype || !inlinetoastmsgkey) return

    const message = t(inlinetoastmsgkey)
    switch (inlinetoasttype.toLowerCase()) {
      case 'success':
        showSuccess(message)
        break
      case 'error':
        showError(message)
        break
      default:
        showWarning(message)
        break
    }

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('inlinetoasttype')
    nextParams.delete('inlinetoastmsgkey')
    const nextQuery = nextParams.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname)
  }, [
    inlinetoastmsgkey,
    inlinetoasttype,
    pathname,
    router,
    searchParams,
    showError,
    showSuccess,
    showWarning,
    t,
  ])

  return { inlineToast, isToastExiting, showSuccess, showError, dismissToast }
}

function renderToastIcon(type: InlineToast['type']) {
  switch (type) {
    case 'success':
      return (
        <span className="inline-flex size-8 shrink-0">
          <ToastSuccess />
        </span>
      )
    case 'error':
      return (
        <span className="inline-flex size-8 shrink-0">
          <ToastError />
        </span>
      )
    case 'warning':
      return (
        <span className="inline-flex size-8 shrink-0">
          <ToastInfo />
        </span>
      )
    default:
      return null
  }
}

export default function InlineToast({
  inlineToast,
  isToastExiting,
  onDismiss,
}: Readonly<{
  inlineToast: InlineToast | null
  isToastExiting: boolean
  onDismiss?: () => void
}>) {
  const [dragOffsetY, setDragOffsetY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartYRef = useRef<number | null>(null)

  useEffect(() => {
    if (!inlineToast) {
      setDragOffsetY(0)
      setIsDragging(false)
      dragStartYRef.current = null
    }
  }, [inlineToast])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (event: MouseEvent) => {
      if (dragStartYRef.current == null) return
      const deltaY = event.clientY - dragStartYRef.current
      setDragOffsetY(Math.min(0, deltaY))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      if (dragOffsetY <= -40) {
        onDismiss?.()
      }
      setDragOffsetY(0)
      dragStartYRef.current = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragOffsetY, isDragging, onDismiss])

  if (!inlineToast) return null

  return (
    <button
      className={`absolute right-11 top-6 z-10 flex items-center gap-3 rounded-xl border border-grey-12 bg-popover px-4 py-3 text-body-emphasize select-none cursor-grab ${isDragging ? 'cursor-grabbing transition-none' : ''} ${isToastExiting ? 'animate-slide-up' : 'animate-slide-down'}`}
      style={{
        transform: dragOffsetY ? `translateY(${dragOffsetY}px)` : undefined,
      }}
      onMouseDown={(event) => {
        dragStartYRef.current = event.clientY
        setIsDragging(true)
      }}
      onClick={onDismiss}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          onDismiss?.()
        }
      }}
    >
      {renderToastIcon(inlineToast.type)}
      <span>{inlineToast.message}</span>
    </button>
  )
}
