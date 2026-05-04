'use client'

import { EmailOtpFieldProps } from '@/models/ui/input'
import { Field, FieldError, FieldLabel } from '@/share/ui/field'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/share/ui/input-otp'
import { useTranslations } from 'next-intl'
import { cn } from '@/share/lib/utils'

export default function EmailOtpField({
  label,
  required = false,
  errors,
  value,
  onChange,
  maxLength = 6,
  disabled = false,
  className,
  containerClassName,
}: Readonly<EmailOtpFieldProps>) {
  const t = useTranslations('form')

  return (
    <Field>
      {label && (
        <FieldLabel>
          {label}
          {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <InputOTP
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        disabled={disabled}
        containerClassName={cn('w-full justify-center', containerClassName)}
        className={className}
      >
        <InputOTPGroup
          className={cn(
            'gap-6 justify-center items-center rounded-lg border-0 bg-transparent shadow-none',
            'has-focus:border-0 has-focus:border-blue-1'
          )}
        >
          {Array.from({ length: maxLength }, (_, i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="rounded-lg first:rounded-l-lg last:rounded-r-lg size-10 text-center text-body-body font-medium border border-grey-1/29 bg-white shadow-xs box-border "
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <FieldError>
        {errors && (
          <>
            {t.has(errors) && label
              ? t(errors, {
                  label: label?.toLowerCase() ?? '',
                })
              : errors}
          </>
        )}
      </FieldError>
    </Field>
  )
}
