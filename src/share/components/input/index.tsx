import { InputFieldProps } from '@/models/ui/input'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/share/ui/field'
import { Input } from '@/share/ui/input'
import { useTranslations } from 'next-intl'
import { FieldValues } from 'react-hook-form'

export default function InputField<T extends FieldValues>({
  label,
  placeholder,
  disabled = false,
  required = false,
  type = 'text',
  size = 'md',
  className = '',
  errors,
  description,
  variant,
  ...props
}: Readonly<InputFieldProps<T>>) {
  const t = useTranslations('form')

  return (
    <Field>
      {label && (
        <FieldLabel>
          <span className="truncate">{label}</span>
          {required && <span className="text-destructive shrink-0">*</span>}
        </FieldLabel>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        label={label}
        variant={variant}
        size={size}
        className={className}
        {...props}
      />
      {description && !errors && (
        <FieldDescription>{description}</FieldDescription>
      )}
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
