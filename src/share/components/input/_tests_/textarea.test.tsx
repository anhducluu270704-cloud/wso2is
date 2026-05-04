
import React from 'react'
import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import TextareaField from '../textarea'

jest.mock('next-intl', () => ({
  useTranslations: () => Object.assign((k: string) => k, { has: () => false }),
}))
jest.mock('@/share/ui/field', () => ({
  Field: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FieldLabel: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
  FieldError: ({ children }: { children: React.ReactNode }) => <div data-slot="error">{children}</div>,
}))
jest.mock('@/share/ui/textarea', () => ({ Textarea: (p: any) => <textarea {...p} /> }))

function FormWithTextarea() {
  const { register } = useForm<{ bio: string }>()
  return (
    <TextareaField
      name="bio"
      register={register}
      label="Bio"
      placeholder="Write here"
      required
    />
  )
}

describe('share/components/input/textarea', () => {
  it('render TextareaField với label và placeholder', () => {
    render(<FormWithTextarea />)
    expect(screen.getByText('Bio')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Write here')).toBeInTheDocument()
  })

  it('render với maxLength và value length', () => {
    function Form() {
      const { register } = useForm<{ desc: string }>()
      return (
        <TextareaField
          name="desc"
          register={register}
          label="Desc"
          maxLength={100}
          value="Hello"
        />
      )
    }
    render(<Form />)
    expect(screen.getByText(/5\/100/)).toBeInTheDocument()
  })

  it('render errors', () => {
    function Form() {
      const { register } = useForm<{ x: string }>()
      return <TextareaField name="x" register={register} errors="error.required" label="X" />
    }
    render(<Form />)
    expect(document.querySelector('[data-slot="error"]')).toHaveTextContent('error.required')
  })

  it('hiển thị t(errors) khi t.has trả về true', () => {
    jest.mock('next-intl', () => ({
      useTranslations: () => Object.assign((k: string) => `translated:${k}`, { has: () => true }),
    }))
    function Form() {
      const { register } = useForm<{ x: string }>()
      return <TextareaField name="x" register={register} errors="form.error.required" label="Field" />
    }
    render(<Form />)
    expect(document.querySelector('[data-slot="error"]')).toBeTruthy()
  })

  it('render không có label không crash', () => {
    function Form() {
      const { register } = useForm<{ x: string }>()
      return <TextareaField name="x" register={register} />
    }
    render(<Form />)
    expect(document.querySelector('textarea')).toBeInTheDocument()
  })

  it('render disabled và rows', () => {
    function Form() {
      const { register } = useForm<{ x: string }>()
      return <TextareaField name="x" register={register} label="X" disabled rows={5} />
    }
    render(<Form />)
    const ta = document.querySelector('textarea') as HTMLTextAreaElement
    expect(ta.disabled).toBe(true)
    expect(ta.rows).toBe(5)
  })

  it('maxLength 0 không hiển thị counter', () => {
    function Form() {
      const { register } = useForm<{ x: string }>()
      return <TextareaField name="x" register={register} label="X" />
    }
    render(<Form />)
    expect(screen.queryByText(/\//)).not.toBeInTheDocument()
  })
})
