
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ExpiredStatus from '../expired'

const mockPush = jest.fn()

const signupCallbackExpiredCopy: Record<string, string> = {
  'callback.expired.title': 'Session expired',
  'callback.expired.description':
    'The verification link has expired. Please start over and sign up again.',
  'callback.expired.btn.signup': 'Sign up',
}

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => signupCallbackExpiredCopy[key] ?? key,
}))
jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))
jest.mock('@/share/components/full-page/error-layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-layout">{children}</div>
  ),
}))
jest.mock('@/share/icons', () => ({
  EndTime: () => <span data-testid="end-time-icon" />,
}))
jest.mock('@/share/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}))
jest.mock('@/share/ui/empty', () => ({
  Empty: ({ children }: any) => <div>{children}</div>,
  EmptyContent: ({ children }: any) => <div>{children}</div>,
  EmptyDescription: ({ children }: any) => <p>{children}</p>,
  EmptyHeader: ({ children }: any) => <div>{children}</div>,
  EmptyTitle: ({ children }: any) => <h2>{children}</h2>,
}))

describe('auth/call-back/expired', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('hiển thị nội dung và nút Sign up', () => {
    render(<ExpiredStatus />)

    expect(screen.getByTestId('error-layout')).toBeInTheDocument()
    expect(screen.getByText('Session expired')).toBeInTheDocument()
    expect(
      screen.getByText(
        'The verification link has expired. Please start over and sign up again.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
  })

  it('Sign up gọi router.push /signup', async () => {
    render(<ExpiredStatus />)

    await userEvent.click(screen.getByRole('button', { name: 'Sign up' }))
    expect(mockPush).toHaveBeenCalledWith('/signup')
  })
})
