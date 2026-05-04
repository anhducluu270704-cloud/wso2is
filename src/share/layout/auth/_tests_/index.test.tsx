
import React from 'react'
import { render, screen } from '@testing-library/react'

import AuthViewLayout from '../index'

jest.mock('@/share/layout/end-user/header', () => ({
  __esModule: true,
  default: () => <div data-testid="eu-header" />,
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    key === 'footer.copyright' ? '© Test copyright' : key,
}))

describe('share/layout/auth', () => {
  it('renders EUHeader, main with children, and footer with copyright', () => {
    render(
      <AuthViewLayout>
        <div>auth-form-slot</div>
      </AuthViewLayout>,
    )

    expect(screen.getByTestId('eu-header')).toBeInTheDocument()
    expect(screen.getByText('auth-form-slot')).toBeInTheDocument()
    expect(screen.getByText('© Test copyright')).toBeInTheDocument()
  })
})
