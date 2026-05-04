
import React from 'react'
import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'

import InputCaptchaField from '../captcha'

jest.mock('next-intl', () => ({
  useTranslations: () =>
    Object.assign(
      (k: string, opts?: { label?: string }) =>
        opts?.label ? `${k}|${opts.label}` : k,
      {
        has: (key: string) => key.startsWith('error.'),
      },
    ),
}))

jest.mock('@/share/ui/field', () => ({
  Field: ({ children }: { children: React.ReactNode }) => (
    <div data-slot="field">{children}</div>
  ),
  FieldLabel: ({ children }: { children: React.ReactNode }) => (
    <label>{children}</label>
  ),
  FieldDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="field-desc">{children}</p>
  ),
  FieldError: ({ children }: { children: React.ReactNode }) => (
    <div data-slot="error">{children}</div>
  ),
}))

jest.mock('@/share/ui/input', () => {
  const React = require('react')
  const Input = React.forwardRef(
    (props: Record<string, unknown>, ref: React.Ref<HTMLInputElement>) => {
      const { register: _reg, label: _lb, ...rest } = props as {
        register?: unknown
        label?: unknown
      }
      return <input ref={ref} data-testid="captcha-input" {...rest} />
    },
  )
  return { Input }
})

type CaptchaForm = { captcha: string }

function CaptchaHarness(
  props: Omit<
    React.ComponentProps<typeof InputCaptchaField<CaptchaForm>>,
    'name' | 'register'
  >,
) {
  const { register } = useForm<CaptchaForm>({ defaultValues: { captcha: '' } })
  return (
    <InputCaptchaField name="captcha" register={register} {...props} />
  )
}

describe('share/components/input/captcha', () => {
  it('render label, required và truyền name vào input', () => {
    render(<CaptchaHarness label="Captcha label" required placeholder="Enter code" />)

    expect(screen.getByText('Captcha label')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()

    const input = screen.getByTestId('captcha-input')
    expect(input).toHaveAttribute('name', 'captcha')
    expect(input).toHaveAttribute('placeholder', 'Enter code')
  })

  it('hiển thị description khi không có errors', () => {
    render(
      <CaptchaHarness
        label="L"
        description={<span>Helper copy</span>}
      />,
    )

    expect(screen.getByTestId('field-desc')).toHaveTextContent('Helper copy')
  })

  it('ẩn description khi có errors', () => {
    render(
      <CaptchaHarness
        label="L"
        description="Should hide"
        errors="error.captcha.bad"
      />,
    )

    expect(screen.queryByTestId('field-desc')).not.toBeInTheDocument()
  })

  it('FieldError: dùng t() khi t.has(errors) và có label', () => {
    render(
      <CaptchaHarness
        label="Captcha Field"
        errors="error.captcha.invalid"
      />,
    )

    expect(screen.getByText('error.captcha.invalid|captcha field')).toBeInTheDocument()
  })

  it('FieldError: hiển thị nguyên errors khi không có trong catalog', () => {
    render(<CaptchaHarness label="L" errors="Something went wrong" />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})
