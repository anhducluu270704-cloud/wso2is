import { Control, FieldValues, Path } from 'react-hook-form'

export type RadioOption = {
  value: string
  label: React.ReactNode
}

export type RadioFieldProps<T extends FieldValues> = Readonly<{
  name: Path<T>
  control: Control<T>
  label?: React.ReactNode
  required?: boolean
  description?: React.ReactNode
  options: ReadonlyArray<RadioOption>
  size?: 'sm' | 'default'
  className?: string
}>
