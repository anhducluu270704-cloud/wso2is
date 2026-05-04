import { Control, FieldValues, Path } from 'react-hook-form'

export type SelectOption = {
  value: string
  label: React.ReactNode
}

export type SelectFieldProps<T extends FieldValues> = Readonly<{
  name: Path<T>
  control: Control<T>
  label?: string
  required?: boolean
  placeholder?: string
  description?: React.ReactNode
  options: ReadonlyArray<SelectOption>
  size?: 'sm' | 'default'
  className?: string
  errors?: string
  /** Khi set (vd: `popper`), menu không dịch theo item đang chọn — hữu ích cho form dài */
  selectContentPosition?: 'popper' | 'item-aligned'
  selectContentAlign?: 'start' | 'center' | 'end'
}>
