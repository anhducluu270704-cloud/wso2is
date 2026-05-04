
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import authApi from '@/services/auth/auth.service'

import { parseTokenKeys, useParseToken } from '../hook'

jest.mock('@/services/auth/auth.service', () => ({
  __esModule: true,
  default: {
    parseToken: jest.fn(),
  },
}))

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
  }
}

describe('auth/sign-up/status/hook', () => {
  beforeEach(() => {
    ;(authApi.parseToken as jest.Mock).mockReset()
  })

  describe('parseTokenKeys', () => {
    it('all và byToken', () => {
      expect(parseTokenKeys.all).toEqual(['auth', 'parse-token'])
      expect(parseTokenKeys.byToken('invite-1')).toEqual([
        'auth',
        'parse-token',
        'invite-1',
      ])
    })
  })

  describe('useParseToken', () => {
    it('gọi authApi.parseToken với token và trả về data khi thành công', async () => {
      const payload = { message: 'ok', code: '200', data: {} }
      ;(authApi.parseToken as jest.Mock).mockResolvedValue(payload)

      const { result } = renderHook(() => useParseToken('tok-xyz'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(authApi.parseToken).toHaveBeenCalledWith('tok-xyz')
      expect(result.current.data).toEqual(payload)
    })
  })
})
