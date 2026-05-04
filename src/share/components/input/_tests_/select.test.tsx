
jest.mock('next-intl', () => ({
  useTranslations: () =>
    Object.assign((k: string) => k, { has: () => false }),
}))

import React from 'react'
import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import SelectField from '../select'

jest.mock('@/share/ui/field', () => ({
  Field: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FieldLabel: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
  FieldContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FieldDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FieldError: ({ children }: { children: React.ReactNode }) => <div data-slot="error">{children}</div>,
}))
jest.mock('@/share/ui/select', () => ({
  Select: ({ children }: any) => <div data-slot="select">{children}</div>,
  SelectTrigger: ({ children }: any) => <button type="button">{children}</button>,
  SelectValue: () => <span>Value</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ value, children }: any) => <div data-value={value}>{children}</div>,
}))

function FormWithSelect() {
  const { control } = useForm<{ role: string }>({ defaultValues: { role: '' } })
  return (
    <SelectField
      name="role"
      control={control}
      label="Role"
      required
      placeholder="Select"
      options={[
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
      ]}
    />
  )
}

describe('share/components/input/select', () => {
  it('render SelectField với label và options', () => {
    render(<FormWithSelect />)
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="select"]')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
  })

  it('render SelectField với description', () => {
    function Form() {
      const { control } = useForm<{ x: string }>()
      return (
        <SelectField
          name="x"
          control={control}
          options={[]}
          description="Choose one"
        />
      )
    }
    render(<Form />)
    expect(screen.getByText('Choose one')).toBeInTheDocument()
  })
})
