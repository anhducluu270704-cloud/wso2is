'use client'

import type { UseCopyActions } from '@/share/hooks/use-copy'
import { CopyIcon } from '@/share/icons'
import { Field, FieldDescription, FieldLabel } from '@/share/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/share/ui/input-group'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

const COPY_INLINE_HIDE_MS = 2000

export default function ReadOnlyInputField({
  value,
  placeholder,
  type = 'text',
  startAddon,
  label,
  copy,
  copyNonce,
  description,
}: Readonly<
  {
    value: string
    placeholder?: string
    type?: 'text' | 'password'
    startAddon?: React.ReactNode
    label?: string
    description?: string
  } & UseCopyActions
>) {
  const t = useTranslations('common')
  const [show, setShow] = useState(false)
  const [copyInlineMessage, setCopyInlineMessage] = useState<string | null>(
    null
  )
  const copyHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** Tránh xóa banner ngay sau khi chính ô này vừa copy (cùng một lần `copyNonce` tăng). */
  const justCopiedHereRef = useRef(false)

  useEffect(() => {
    return () => {
      if (copyHideTimerRef.current) {
        clearTimeout(copyHideTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (justCopiedHereRef.current) {
      justCopiedHereRef.current = false
      return
    }
    if (copyHideTimerRef.current) {
      clearTimeout(copyHideTimerRef.current)
      copyHideTimerRef.current = null
    }
    const id = window.setTimeout(() => {
      setCopyInlineMessage(null)
    }, 0)
    return () => clearTimeout(id)
  }, [copyNonce])

  const handleCopy = async () => {
    const ok = await copy(value)
    if (!ok) return
    justCopiedHereRef.current = true
    if (copyHideTimerRef.current) {
      clearTimeout(copyHideTimerRef.current)
    }
    setCopyInlineMessage(t('copy.inline_success'))
    copyHideTimerRef.current = setTimeout(() => {
      setCopyInlineMessage(null)
      copyHideTimerRef.current = null
    }, COPY_INLINE_HIDE_MS)
  }

  const passwordFieldType: 'text' | 'password' = show ? 'text' : 'password'
  const inputType = type === 'password' ? passwordFieldType : type

  return (
    <Field>
      {label && (
        <FieldLabel>
          <span className="truncate">{label}</span>
        </FieldLabel>
      )}
      <InputGroup className="bg-white">
        {startAddon && (
          <InputGroupAddon
            align="inline-start"
            className="text-black-1 whitespace-nowrap"
          >
            {startAddon}
          </InputGroupAddon>
        )}
        <InputGroupInput
          value={value}
          placeholder={placeholder}
          disabled
          type={inputType}
          size="sm"
          data-password-toggle="none"
        />
        <InputGroupAddon align="inline-end" className="gap-1">
          {copyInlineMessage && (
            <span
              className="max-w-[min(11rem,calc(100vw-8rem))] truncate text-body-body text-grey-6"
              aria-live="polite"
            >
              {copyInlineMessage}
            </span>
          )}
          {type === 'password' && (
            <InputGroupButton
              type="button"
              variant="secondary"
              size="icon-sm"
              onClick={() => setShow((v) => !v)}
            >
              {show ? <EyeOffIcon /> : <EyeIcon />}
            </InputGroupButton>
          )}
          <InputGroupButton
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={() => void handleCopy()}
          >
            <CopyIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {description && (
        <FieldDescription>
          <span className="truncate">{description}</span>
        </FieldDescription>
      )}
    </Field>
  )
}
