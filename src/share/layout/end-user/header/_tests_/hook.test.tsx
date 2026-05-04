
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LOCALE_SELECTED_KEY } from '@/constants/system'

jest.mock('next-intl', () => ({
  useLocale: () => 'vi',
  useTranslations: () => (key: string) => key,
}))
jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => null,
}))

const mockPush = jest.fn()
const mockSignIn = jest.fn()
const mockToastError = jest.fn()

jest.mock('@/i18n/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))
jest.mock('@/services/auth/auth.service', () => ({
  __esModule: true,
  default: { signIn: (...args: any[]) => mockSignIn(...args) },
}))
jest.mock('sonner', () => ({ toast: { error: (...args: any[]) => mockToastError(...args) } }))

import { useGetUrlLoginMutation } from '../hook'

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

describe('share/layout/end-user/header/hook', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockSignIn.mockReset()
    mockToastError.mockClear()
    mockSignIn.mockResolvedValue({ data: 'https://login.url' })
    const store: Record<string, string> = { [LOCALE_SELECTED_KEY]: 'vi_VN' }
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => {
          store[k] = v
        },
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
    })
  })

  it('useGetUrlLoginMutation onSuccess gọi router.push', async () => {
    const { result } = renderHook(() => useGetUrlLoginMutation(), { wrapper })

    result.current.mutate()

    await waitFor(() =>
      expect(mockSignIn).toHaveBeenCalledWith(
        `${window.location.origin}/vi/get-token`,
      ),
    )
    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        'https://login.url/?ui_locales=vi_VN',
      ),
    )
  })

  it('useGetUrlLoginMutation onError gọi toast.error', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    mockSignIn.mockRejectedValueOnce({
      response: {
        data: {
          error: 'Login failed',
        },
      },
    })

    const { result } = renderHook(() => useGetUrlLoginMutation(), { wrapper })

    result.current.mutate()

    await waitFor(() => expect(mockToastError).toHaveBeenCalledWith('Login failed'))

    consoleError.mockRestore()
  })
})
