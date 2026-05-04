
import React from 'react'
import { render, screen } from '@testing-library/react'
import EmailOtpField from '../emailotp'

jest.mock('next-intl', () => ({
  useTranslations: () => {
    const t: ((k: string, opts?: { label?: string }) => string) & {
      has: (key: string) => boolean
    } = Object.assign(
      (k: string, opts?: { label?: string }) =>
        opts?.label ? `${k}:${opts.label}` : k,
      {
        has: (key: string) => key === 'invalid_otp',
      }
    )
    return t
  },
}))
jest.mock('@/share/ui/field', () => ({
  Field: ({ children }: { children: React.ReactNode }) => <div data-slot="field">{children}</div>,
  FieldLabel: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
  FieldError: ({ children }: { children: React.ReactNode }) => <div data-slot="error">{children}</div>,
}))
jest.mock('@/share/ui/input-otp', () => ({
  InputOTP: ({ value, onChange, maxLength }: any) => (
    <div data-testid="input-otp">
      <input
        data-testid="otp-input"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        maxLength={maxLength}
      />
    </div>
  ),
  InputOTPGroup: ({ children }: any) => <div>{children}</div>,
  InputOTPSlot: () => <div data-slot="slot" />,
}))

describe('share/components/input/emailotp', () => {
  it('render EmailOtpField với label và required', () => {
    render(<EmailOtpField label="OTP" required value="" onChange={() => {}} />)
    expect(screen.getByText('OTP')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('render EmailOtpField không label', () => {
    render(<EmailOtpField value="123" onChange={() => {}} />)
    expect(screen.getByTestId('input-otp')).toBeInTheDocument()
  })

  it('render với maxLength', () => {
    render(<EmailOtpField value="" onChange={() => {}} maxLength={6} />)
    expect(screen.getByTestId('otp-input')).toHaveAttribute('maxLength', '6')
  })

  it('render errors khi có errors', () => {
    render(<EmailOtpField value="" onChange={() => {}} errors="invalid_otp" label="OTP" />)
    expect(document.querySelector('[data-slot="error"]')).toHaveTextContent(
      'invalid_otp:otp'
    )
  })

  it('render errors plain text khi t.has trả về false', () => {
    render(<EmailOtpField value="" onChange={() => {}} errors="other_error" />)
    expect(document.querySelector('[data-slot="error"]')).toHaveTextContent(
      'other_error'
    )
  })
})
