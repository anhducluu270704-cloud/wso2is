import { DebouncedInputProps } from '@/models/ui/input'
import { cn } from '@/share/lib/utils'
import { inputVariants } from '@/share/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from '@/share/ui/input-group'
import { SearchIcon, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useRef, useState } from 'react'

export default function SearchInput({
  type = 'text',
  placeholder,
  value = '',
  size = 'sm',
  onChange,
  className = '',
  ...props
}: Readonly<DebouncedInputProps>) {
  const t = useTranslations('form')
  const id = useId()
  const [text, setText] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  const isComposingRef = useRef(false)

  useEffect(() => {
    if (isComposingRef.current) return
    if (inputRef.current === document.activeElement) return
    setText(value)
  }, [value])

  const placeholderText =
    placeholder ?? t('input.search_placeholder', { label: 'undefined' })

  return (
    <InputGroup
      className={cn(
        size === 'xl' ? 'h-16 py-4 px-6' : 'rounded-md',
        'relative rounded-full'
      )}
    >
      <InputGroupAddon align="inline-start" htmlFor={id}>
        <InputGroupText>
          <SearchIcon
            className={cn(
              size === 'xl' ? 'size-8 !text-grey-6' : 'size-5',
              'stroke-2 text-black-1'
            )}
          />
        </InputGroupText>
      </InputGroupAddon>
      <input
        id={id}
        ref={inputRef}
        placeholder={placeholderText}
        type={type}
        value={text}
        data-slot="input-group-control"
        className={inputVariants({
          ...props,
          size: size,
          className:
            'flex-1 min-w-0 rounded-none border-0 bg-transparent pr-6 dark:bg-transparent' +
            className,
        })}
        onCompositionStart={() => {
          isComposingRef.current = true
        }}
        onCompositionEnd={(e) => {
          isComposingRef.current = false
          setText(e.currentTarget.value)
          queueMicrotask(() => {
            const input = inputRef.current
            if (input) input.scrollLeft = input.scrollWidth
          })
        }}
        onChange={(e) => {
          const el = e.target
          const next = el.value
          const atEnd =
            el.selectionStart == null || el.selectionStart === next.length
          setText(next)
          onChange(next)
          if (atEnd) {
            queueMicrotask(() => {
              const input = inputRef.current
              if (input) input.scrollLeft = input.scrollWidth
            })
          }
        }}
      />
      {text && (
        <button
          type="button"
          onClick={() => {
            onChange('')
            setText('')
            inputRef.current?.focus()
          }}
          className={cn(
            size === 'xl' ? 'right-6' : 'right-3',
            'absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-grey-6 hover:bg-grey-5 transition-colors cursor-pointer'
          )}
        >
          <X className="size-5 text-white" />
        </button>
      )}
    </InputGroup>
  )
}
