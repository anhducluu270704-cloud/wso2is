
import React from 'react'
import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import InputField from '../index'

jest.mock('next-intl', () => ({
  useTranslations: () => Object.assign((k: string) => k, { has: (key: string) => key === 'error.required' }),
}))
jest.mock('@/share/ui/field', () => ({
  Field: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FieldLabel: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
  FieldDescription: ({ children }: { children: React.ReactNode }) => <div data-slot="description">{children}</div>,
  FieldError: ({ children }: { children: React.ReactNode }) => <div data-slot="error">{children}</div>,
}))
jest.mock('@/share/ui/input', () => ({ Input: (p: any) => <input {...p} /> }))

describe('share/components/input/index', () => {
  it('render InputField không có label', () => {
    render(<InputField placeholder="Enter" />)
    expect(screen.getByPlaceholderText('Enter')).toBeInTheDocument()
    expect(document.querySelector('label')).not.toBeInTheDocument()
  })

  it('render InputField với label và description', () => {
    render(<InputField label="Email" description="Your email" placeholder="e@mail.com" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="description"]')).toHaveTextContent('Your email')
  })

  it('render InputField errors với t.has true và label', () => {
    render(<InputField label="Name" errors="error.required" />)
    expect(document.querySelector('[data-slot="error"]')).toHaveTextContent('error.required')
  })

  it('render InputField errors khi t.has false hiển thị raw errors', () => {
    render(<InputField label="X" errors="Something went wrong" />)
    expect(document.querySelector('[data-slot="error"]')).toHaveTextContent('Something went wrong')
  })

  it('render InputField errors với t.has true và không có label dùng label empty', () => {
    render(<InputField errors="error.required" />)
    // t.has(errors) = true nhưng label = undefined → hiển thị raw errors
    expect(document.querySelector('[data-slot="error"]')).toHaveTextContent('error.required')
  })
})
