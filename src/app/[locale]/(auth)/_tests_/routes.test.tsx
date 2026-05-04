
import React from 'react'
import { render, screen } from '@testing-library/react'

const mockNotFound = jest.fn()

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}))

jest.mock('@/providers/auth-provider', () => ({
  useAuth: () => ({ isLoading: false, authInfo: null }),
}))

jest.mock('@/providers/auth-session-provider', () => ({
  AuthSessionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

jest.mock('@/share/layout/auth', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => <div>Loading</div>,
}))

jest.mock('@/components/auth/get-token', () => ({
  __esModule: true,
  default: ({ code }: { code: string }) => <div>GetTokenWrapper:{code}</div>,
}))

jest.mock('@/components/auth/sign-up/status', () => ({
  __esModule: true,
  default: () => <div>SignUpStatus</div>,
}))

describe('auth routes', () => {
  beforeEach(() => {
    mockNotFound.mockClear()
  })

  it('get-token page metadata, notFound branch, and success branch', async () => {
    const module = await import('../get-token/page')

    expect(module.metadata).toEqual({ title: 'Get Token', description: '' })

    const missing = await module.default({
      searchParams: Promise.resolve({}),
    } as any)
    render(<>{missing}</>)
    expect(mockNotFound).toHaveBeenCalled()

    const ok = await module.default({
      searchParams: Promise.resolve({ code: 'abc' }),
    } as any)
    render(<>{ok}</>)
    expect(screen.getByText('GetTokenWrapper:abc')).toBeInTheDocument()
  })

})
