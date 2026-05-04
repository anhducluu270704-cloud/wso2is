import { inputVariants } from "@/share/ui/input"
import { VariantProps } from "class-variance-authority"
import { Control, FieldValues, Path, UseFormRegister } from "react-hook-form"

export type BaseLayoutInputProps = Readonly<{
  id?: string
  label?: string
  required?: boolean
  className?: string
  placeholder?: string
  errors?: string
  description?: React.ReactNode
}>

type BaseInputProps = Readonly<
  VariantProps<typeof inputVariants> &
  BaseLayoutInputProps & {
    type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'time' | 'search'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    variant?: 'default' | 'error' | 'success'
    value?: string
    defaultValue?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
    onFocus?: React.FocusEventHandler<HTMLInputElement>
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    disabled?: boolean
    min?: string
    max?: string
    step?: number
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
  }
>

//props input sử dụng trong form theo chuẩn react-hook-form
export type InputFieldProps<T extends FieldValues> = Readonly<
  | ({
    name: Path<T>
    register: UseFormRegister<T>
  } & BaseInputProps)
  | ({
    name?: never
    register?: never
  } & BaseInputProps)
>

export type BaseTextareaProps = Readonly<
  BaseLayoutInputProps & {
    value?: string
    defaultValue?: string
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>
    onFocus?: React.FocusEventHandler<HTMLTextAreaElement>
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>
    disabled?: boolean
    rows?: number
    maxLength?: number
  }
>

export type TextareaFieldProps<T extends FieldValues> = Readonly<
  | ({
    name: Path<T>
    register: UseFormRegister<T>
  } & BaseTextareaProps)
  | ({
    name?: never
    register?: never
  } & BaseTextareaProps)
>

export type DebouncedInputProps = Readonly<
  Omit<BaseInputProps, 'onChange'> & {
    value?: string
    onChange: (value: string) => void
  }
>

export type EmailOtpFieldProps = Readonly<
  BaseLayoutInputProps & {
    value: string
    onChange: (value: string) => void
    maxLength?: number
    disabled?: boolean
    containerClassName?: string
  }
>

interface BaseArrayInputProps
  extends Omit<VariantProps<typeof inputVariants>, 'onChange'>,
  BaseLayoutInputProps {
  defaultValues?: string[]
  onArrayChange?: (values: string[]) => void
  error?: string | null
  canAdd?: (values: string[]) => boolean
  disabled?: boolean
  addButtonText?: string
  itemPlaceholder?: string
  readonlyAfterFirst?: boolean
  hideDeleteForFirst?: boolean
  addPlacement?: 'start' | 'end'
  addAtStart?: boolean
}

export type ArrayInputProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  register: UseFormRegister<T>
} & BaseArrayInputProps