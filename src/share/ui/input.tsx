'use client'

import { InputFieldProps } from '@/models/ui/input'
import { cn } from '@/share/lib/utils'
import { cva } from 'class-variance-authority'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { FieldValues } from 'react-hook-form'

export const inputVariants = cva(
  'border bg-white text-black-1 transition-[color,box-shadow] file:font-medium file:text-foreground placeholder:text-body-body placeholder:text-grey-4 w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed dark:bg-input/30',
  {
    variants: {
      size: {
        xs: 'h-6 px-2 py-0 rounded-md text-body-helptext file:h-5 file:text-body-helptext',
        sm: 'h-10 px-4 py-0 rounded-md text-body-body file:h-7 file:text-body-body',
        md: 'h-11 px-4 py-0 rounded-lg text-body-body file:h-7 file:text-body-body',
        lg: 'h-12 px-3 py-0 rounded-lg text-body-body file:h-8 file:text-body-body',
        xl: 'h-8 rounded-lg text-title-md-emphasize font-light file:h-8 file:text-body-body',
      },
      variant: {
        default:
          'border border-grey-1/29 focus:border-blue-2 focus-visible:border-blue-2 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50',
        error: 'border-red-1 focus:border-red-1 focus-visible:border-red-1',
        success: 'border-green-1 focus-visible:border-green-1',
      },
      disabled: {
        true: 'bg-grey-3',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      disabled: false,
    },
  }
)

const Input = React.forwardRef(function InputInner<T extends FieldValues>(
  {
    className,
    id,
    type,
    name,
    register,
    disabled,
    placeholder,
    label,
    size,
    variant,
    ...props
  }: InputFieldProps<T>,
  ref: React.Ref<HTMLInputElement>
) {
  const t = useTranslations('form')
  const registerResult = name && register ? register(name) : undefined
  const registerPayload = registerResult ?? {}
  const {
    ref: registerRef,
    onBlur: registerOnBlur,
    onFocus: registerOnFocus,
    ...registerRest
  } = registerPayload as {
    ref?: React.Ref<HTMLInputElement>
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    name?: string
    [k: string]: unknown
  }

  const { onBlur: propsOnBlur, onFocus: propsOnFocus, ...restProps } = props

  const [isShowPassword, setIsShowPassword] = React.useState(false)

  const inputType = () =>
    type === 'password' && isShowPassword ? 'text' : type

  const passwordToggle =
    (props as { 'data-password-toggle'?: 'none' | 'default' })[
      'data-password-toggle'
    ] ?? 'default'
  const showPasswordToggle = type === 'password' && passwordToggle !== 'none'

  return (
    <div className="relative z-0 flex w-full min-w-0 items-center gap-2">
      <input
        {...restProps}
        {...(name && register
          ? {
              ...registerRest,
              name,
              onChange: (
                registerRest as {
                  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
                }
              ).onChange,
              ref: registerRef,
            }
          : { ref })}
        onBlur={(e) => {
          registerOnBlur?.(e)
          propsOnBlur?.(e)
        }}
        onFocus={(e) => {
          registerOnFocus?.(e)
          propsOnFocus?.(e)
        }}
        id={id}
        type={inputType()}
        // data-slot="input"
        placeholder={
          placeholder ??
          t('input.placeholder', {
            label: label?.toLowerCase() ?? '',
          })
        }
        required={false}
        disabled={disabled}
        className={cn(
          inputVariants({
            variant,
            disabled,
            className,
            size,
            ...restProps,
          }),
          showPasswordToggle && 'pr-9'
        )}
      />
      {showPasswordToggle && (
        <button
          type="button"
          className="absolute right-4 cursor-pointer p-0 border-0 bg-transparent"
          onClick={() => setIsShowPassword(!isShowPassword)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsShowPassword((v) => !v)
            }
          }}
          aria-label={isShowPassword ? 'Hide password' : 'Show password'}
        >
          {isShowPassword ? (
            <EyeOffIcon className="size-5 stroke-grey-5" />
          ) : (
            <EyeIcon className="size-5 stroke-grey-5" />
          )}
        </button>
      )}
    </div>
  )
}) as <T extends FieldValues>(
  props: InputFieldProps<T> & { ref?: React.Ref<HTMLInputElement> }
) => React.ReactElement

export { Input }
