
import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('@/providers/recaptcha-provider', () => ({
  AuthRecaptchaProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-recaptcha-provider">{children}</div>
  ),
}))

import SignupLayout, { metadata } from '../layout'

describe('app/[locale]/(auth)/signup/layout', () => {
  it('exports metadata', () => {
    expect(metadata).toEqual({ title: 'Signup', description: '' })
  })

  it('bọc children bằng AuthRecaptchaProvider', () => {
    render(
      <SignupLayout>
        <div>signup-child</div>
      </SignupLayout>,
    )

    expect(screen.getByTestId('auth-recaptcha-provider')).toBeInTheDocument()
    expect(screen.getByText('signup-child')).toBeInTheDocument()
  })
})
