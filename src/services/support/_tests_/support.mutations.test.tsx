
/**
 * Unit test: services/support - support mutations
 */
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSupportRequestMutation } from '../support.mutations'

jest.mock('../support.service', () => ({
  __esModule: true,
  default: { create: jest.fn() },
}))
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
jest.mock('sonner', () => ({ toast: { dismiss: jest.fn(), loading: jest.fn(), success: jest.fn(), error: jest.fn() } }))

const supportApi = require('../support.service').default

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('support.mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(supportApi.create as jest.Mock).mockResolvedValue({})
  })

  it('useSupportRequestMutation success', async () => {
    const { result } = renderHook(() => useSupportRequestMutation(), { wrapper: createWrapper() })
    result.current.mutate({
      full_name: 'User',
      email: 'a@b.com',
      company_name: 'Co',
      phone_number: '0901234567',
      request_type: 'general',
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(supportApi.create).toHaveBeenCalled()
    const { toast } = require('sonner')
    expect(toast.success).toHaveBeenCalled()
  })

  it('useSupportRequestMutation onError', async () => {
    ;(supportApi.create as jest.Mock).mockRejectedValueOnce(new Error('fail'))
    const { result } = renderHook(() => useSupportRequestMutation(), { wrapper: createWrapper() })
    result.current.mutate({
      full_name: 'U',
      email: 'e@e.com',
      company_name: 'C',
      phone_number: '0',
      request_type: 'general',
    })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(require('sonner').toast.error).toHaveBeenCalled()
  })
})
