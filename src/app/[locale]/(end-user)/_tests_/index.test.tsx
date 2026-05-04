
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, jest, beforeEach } from '@jest/globals'

const mockUseAuth = jest.fn()

jest.mock('@/providers/auth-provider', () => ({
  useAuth: () => mockUseAuth(),
}))

jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => <div>LoadingPage</div>,
}))

jest.mock('@/providers/auth-session-provider', () => ({
  AuthSessionProvider: ({
    children,
    authSession,
  }: {
    children: React.ReactNode
    authSession: unknown
  }) => (
    <div data-testid="auth-session-provider" data-auth-session={JSON.stringify(authSession)}>
      {children}
    </div>
  ),
}))

jest.mock('@/share/layout/end-user/header', () => ({
  __esModule: true,
  default: () => <div>EUHeader</div>,
}))

jest.mock('@/share/layout/end-user/footer', () => ({
  __esModule: true,
  default: () => <div>EUFooter</div>,
}))

describe('EndUser AllRolesLayout', () => {
  const CHILD_TEXT = 'End user children'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders LoadingPage when auth is loading', async () => {
    mockUseAuth.mockReturnValue({ isLoading: true, authInfo: null })
    const { default: AllRolesLayout } = await import('../layout')

    render(
      <AllRolesLayout>
        <div>{CHILD_TEXT}</div>
      </AllRolesLayout>
    )

    expect(screen.getByText('LoadingPage')).toBeTruthy()
    expect(screen.queryByText('EUHeader')).toBeNull()
    expect(screen.queryByText('EUFooter')).toBeNull()
  })

  it('wraps children with providers, header and footer when not loading', async () => {
    const authInfo = { userId: 'user-1' }
    mockUseAuth.mockReturnValue({ isLoading: false, authInfo })
    const { default: AllRolesLayout } = await import('../layout')

    render(
      <AllRolesLayout>
        <div>{CHILD_TEXT}</div>
      </AllRolesLayout>
    )

    const provider = screen.getByTestId('auth-session-provider')
    expect(provider).toBeTruthy()
    expect(provider.getAttribute('data-auth-session')).toEqual(
      JSON.stringify(authInfo)
    )

    expect(screen.getByText('EUHeader')).toBeTruthy()
    expect(screen.getByText('EUFooter')).toBeTruthy()
    expect(screen.getByText(CHILD_TEXT)).toBeTruthy()
  })
})

