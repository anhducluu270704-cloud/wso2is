
import React from 'react'
import { render, screen } from '@testing-library/react'

const mockPush = jest.fn()

jest.mock('@/providers/auth-provider', () => ({
  useAuth: jest.fn(),
}))

jest.mock('@/i18n/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: jest.fn(),
  })),
}))

jest.mock('@/providers/auth-session-provider', () => ({
  AuthSessionProvider: ({
    children,
    authSession,
  }: {
    children: React.ReactNode
    authSession: unknown
  }) => (
    <div data-testid="session-wrap" data-has-session={authSession ? '1' : '0'}>
      {children}
    </div>
  ),
}))

jest.mock('@/share/layout/auth', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-view-layout">{children}</div>
  ),
}))

jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-page">Loading</div>,
}))

import * as Auth from '@/providers/auth-provider'
import AuthLayout from '../layout'

describe('app/[locale]/(auth)/layout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Auth.useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      authInfo: null,
    })
  })

  it('isLoading: chỉ render LoadingPage', () => {
    ;(Auth.useAuth as jest.Mock).mockReturnValue({
      isLoading: true,
      authInfo: null,
    })

    render(
      <AuthLayout>
        <div>Auth child</div>
      </AuthLayout>,
    )

    expect(screen.getByTestId('loading-page')).toBeInTheDocument()
    expect(screen.queryByText('Auth child')).not.toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('đã load, chưa đăng nhập: render layout, không redirect', () => {
    render(
      <AuthLayout>
        <div>Auth child</div>
      </AuthLayout>,
    )

    expect(screen.queryByTestId('loading-page')).not.toBeInTheDocument()
    expect(screen.getByText('Auth child')).toBeInTheDocument()
    expect(screen.getByTestId('auth-view-layout')).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
    expect(screen.getByTestId('session-wrap')).toHaveAttribute(
      'data-has-session',
      '0',
    )
  })

  it('đã có authInfo: router.push("/") và vẫn render children', () => {
    ;(Auth.useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      authInfo: { token: 'session-token' },
    })

    render(
      <AuthLayout>
        <div>Auth child</div>
      </AuthLayout>,
    )

    expect(mockPush).toHaveBeenCalledWith('/')
    expect(screen.queryByTestId('loading-page')).not.toBeInTheDocument()
    expect(screen.getByText('Auth child')).toBeInTheDocument()
    expect(screen.getByTestId('session-wrap')).toHaveAttribute(
      'data-has-session',
      '1',
    )
  })
})
