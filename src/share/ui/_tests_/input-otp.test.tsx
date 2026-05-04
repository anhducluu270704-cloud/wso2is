
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/share/ui/input-otp'
import { OTPInputContext } from 'input-otp'

jest.mock('input-otp', () => {
  const React = require('react')
  return {
    OTPInput: ({ containerClassName, className, ...props }: any) => (
      <div
        data-testid="otp-input"
        data-container-class={containerClassName}
        data-class={className}
        {...props}
      />
    ),
    OTPInputContext: React.createContext({ slots: [] }),
  }
})

jest.mock('lucide-react', () => ({
  MinusIcon: () => <span data-testid="minus-icon" />,
}))

describe('share/ui/input-otp', () => {
  it('render InputOTP và group', () => {
    render(
      <InputOTPGroup className="custom-group">
        <InputOTP maxLength={6} containerClassName="otp-container" className="otp-class" />
      </InputOTPGroup>
    )

    expect(screen.getByTestId('otp-input')).toHaveAttribute(
      'data-container-class',
      expect.stringContaining('otp-container')
    )
    expect(screen.getByTestId('otp-input')).toHaveAttribute(
      'data-class',
      expect.stringContaining('otp-class')
    )
    expect(document.querySelector('[data-slot="input-otp-group"]')).toHaveClass('custom-group')
  })

  it('render InputOTPSlot với char và fake caret', () => {
    render(
      <OTPInputContext.Provider
        value={{ slots: [{ char: '1', hasFakeCaret: true, isActive: true }] }}
      >
        <InputOTPSlot index={0} className="custom-slot" />
      </OTPInputContext.Provider>
    )

    const slot = document.querySelector('[data-slot="input-otp-slot"]')
    expect(slot).toHaveTextContent('1')
    expect(slot).toHaveAttribute('data-active', 'true')
    expect(slot).toHaveClass('custom-slot')
    expect(document.querySelector('.animate-caret-blink')).toBeInTheDocument()
  })

  it('render InputOTPSlot khi không có context và separator', () => {
    render(
      <>
        <InputOTPSlot index={1} />
        <InputOTPSeparator />
      </>
    )

    expect(document.querySelector('[data-slot="input-otp-slot"]')).not.toHaveAttribute(
      'data-active'
    )
    expect(document.querySelector('[data-slot="input-otp-separator"]')).toBeInTheDocument()
    expect(screen.getByTestId('minus-icon')).toBeInTheDocument()
  })
})
