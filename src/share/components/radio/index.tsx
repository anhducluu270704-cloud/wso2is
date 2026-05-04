import { RadioFieldProps } from '@/models/ui/radio'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/share/ui/field'
import { RadioGroup, RadioGroupItem } from '@/share/ui/radio-group'
import { Controller, FieldValues } from 'react-hook-form'

export default function RadioGroupField<T extends FieldValues>({
  name,
  control,
  label,
  required,
  description,
  options,
}: Readonly<RadioFieldProps<T>>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          {label && (
            <FieldLabel>
              {label}
              {required && <span className="text-destructive">*</span>}
            </FieldLabel>
          )}
          <FieldContent>
            <RadioGroup
              className="flex flex-wrap items-center gap-6"
              value={field.value}
              onValueChange={field.onChange}
            >
              {options.map((option) => (
                <div
                  className="inline-flex items-center gap-2"
                  key={option.value}  
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <span className='text-body-body'>{option.label}</span>
                </div>
              ))}
            </RadioGroup>
          </FieldContent>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError>{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  )
}
