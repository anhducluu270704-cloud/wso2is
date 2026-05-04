'use client'

import { Controller, FieldValues } from 'react-hook-form'

import { SelectFieldProps } from '@/models/ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/share/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/share/ui/select'
import { useTranslations } from 'next-intl'

export default function InputSelectField<T extends FieldValues>({
  name,
  control,
  label,
  required,
  placeholder,
  description,
  options,
  size,
  className,
  errors,
  selectContentPosition,
  selectContentAlign,
}: Readonly<SelectFieldProps<T>>) {
  const t = useTranslations('form')
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field>
          {label && (
            <FieldLabel>
              {label}
              {required && <span className="text-destructive">*</span>}
            </FieldLabel>
          )}
          <FieldContent>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger size={size} className={className}>
                <SelectValue
                  placeholder={
                    placeholder ??
                    t('input.placeholder', {
                      label: label?.toLowerCase() ?? '',
                    })
                  }
                />
              </SelectTrigger>
              <SelectContent
                {...(selectContentPosition !== undefined
                  ? {
                      position: selectContentPosition,
                      ...(selectContentAlign !== undefined
                        ? { align: selectContentAlign }
                        : {}),
                    }
                  : {})}
              >
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
          {description && <FieldDescription>{description}</FieldDescription>}
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
      )}
    />
  )
}
