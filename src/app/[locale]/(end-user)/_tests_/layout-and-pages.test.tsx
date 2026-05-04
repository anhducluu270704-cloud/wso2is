
import React from 'react'
import { render, screen } from '@testing-library/react'

const mockUseAuth = jest.fn()
const mockMutate = jest.fn()
const mockUsePathname = jest.fn()

jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => <div>LoadingPage</div>,
}))

jest.mock('@/providers/auth-provider', () => ({
  useAuth: () => mockUseAuth(),
}))

jest.mock('@/providers/auth-session-provider', () => ({
  AuthSessionProvider: ({
    children,
    authSession,
  }: {
    children: React.ReactNode
    authSession: unknown
  }) => <div data-auth={String(Boolean(authSession))}>{children}</div>,
}))

jest.mock('@/share/layout/end-user/footer', () => ({
  __esModule: true,
  default: () => <div>EUFooter</div>,
}))

jest.mock('@/share/layout/end-user/header', () => ({
  __esModule: true,
  default: () => <div>EUHeader</div>,
}))

jest.mock('@/share/layout/end-user/header/hook', () => ({
  useGetUrlLoginMutation: () => ({ mutate: mockMutate }),
}))

jest.mock('next-intl', () => ({
  useLocale: () => 'vi',
}))

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

jest.mock('@/components/redirect', () => ({
  __esModule: true,
  default: ({ href }: { href: unknown }) => <div>{JSON.stringify(href)}</div>,
}))

describe('end-user layout and pages', () => {
  beforeEach(() => {
    mockUseAuth.mockReset()
    mockMutate.mockClear()
    mockUsePathname.mockReturnValue('/dashboard')
  })

  it('AllRolesLayout shows loading while auth is loading', async () => {
    mockUseAuth.mockReturnValue({ isLoading: true, authInfo: null })
    const { default: AllRolesLayout } = await import('../layout')

    render(
      <AllRolesLayout>
        <div>Child</div>
      </AllRolesLayout>
    )

    expect(screen.getByText('LoadingPage')).toBeInTheDocument()
  })

  it('AllRolesLayout renders header footer and children when ready', async () => {
    mockUseAuth.mockReturnValue({ isLoading: false, authInfo: { sub: '1' } })
    const { default: AllRolesLayout } = await import('../layout')

    render(
      <AllRolesLayout>
        <div>Child</div>
      </AllRolesLayout>
    )

    expect(screen.getByText('EUHeader')).toBeInTheDocument()
    expect(screen.getByText('Child')).toBeInTheDocument()
    expect(screen.getByText('EUFooter')).toBeInTheDocument()
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('Dashboard page redirects to api-products with pathname', async () => {
    const { default: DashboardPage } = await import('../page')

    render(<DashboardPage />)

    expect(
      screen.getByText(
        JSON.stringify({
          pathname: '/api-products',
          params: { redirect: '/dashboard' },
        })
      )
    ).toBeInTheDocument()
  })
})
