import { TextareaFieldProps } from '@/models/ui/input'
import { Field, FieldError, FieldLabel } from '@/share/ui/field'
import { Textarea } from '@/share/ui/textarea'
import { useTranslations } from 'next-intl'
import { FieldValues } from 'react-hook-form'

export default function TextareaField<T extends FieldValues>({
  label,
  placeholder,
  disabled,
  required,
  className = '',
  errors,
  name,
  register,
  rows,
  maxLength,
  ...props
}: Readonly<TextareaFieldProps<T>>) {
  const t = useTranslations('form')

  return (
    <Field>
      {label && (
        <div className="flex items-center justify-between gap-2">
          <FieldLabel>
            {label}
            {required && <span className="text-destructive">*</span>}
          </FieldLabel>
          {maxLength && (
            <div className="text-body-helptext text-grey-6">
              {props.value?.length ?? 0}/{maxLength}
            </div>
          )}
        </div>
      )}
      <Textarea
        placeholder={
          placeholder ??
          t('input.placeholder', {
            label: label?.toLowerCase() ?? '',
          })
        }
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={className}
        {...(name && register ? register(name) : {})}
        {...props}
      />
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
