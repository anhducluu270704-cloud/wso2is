
import React from 'react'
import { render, screen } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import ReactQueryProvider from '../query-client-provider'

const mockLogout = jest.fn()
jest.mock('../auth-provider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({ logout: mockLogout }),
}))
jest.mock('sonner', () => ({
  toast: { error: jest.fn() },
}))

function ClientCapture({ onCapture }: { onCapture: (client: ReturnType<typeof useQueryClient>) => void }) {
  const client = useQueryClient()
  React.useEffect(() => {
    onCapture(client)
  }, [client, onCapture])
  return null
}

describe('providers/query-client-provider', () => {
  beforeEach(() => {
    mockLogout.mockClear()
    require('sonner').toast.error.mockClear()
  })

  it('render children', () => {
    render(
      <ReactQueryProvider>
        <span>Child</span>
      </ReactQueryProvider>
    )
    expect(screen.getByText('Child')).toBeInTheDocument()
  })

  it('QueryClient có defaultOptions: retry false cho 401, refetchOnWindowFocus false, staleTime 5 phút', () => {
    let captured: ReturnType<typeof useQueryClient> | null = null
    render(
      <ReactQueryProvider>
        <ClientCapture onCapture={(c) => { captured = c }} />
      </ReactQueryProvider>
    )
    expect(captured).not.toBeNull()
    const opts = captured!.getDefaultOptions()
    expect(opts.queries?.refetchOnWindowFocus).toBe(false)
    expect(opts.queries?.staleTime).toBe(1000 * 60 * 5)
    const retry = opts.queries?.retry as (n: number, e: unknown) => boolean
    const err401 = { response: { status: 401 } } as AxiosError<unknown>
    const err500 = { response: { status: 500 } } as AxiosError<unknown>
    expect(retry(0, err401)).toBe(false)
    expect(retry(0, err500)).toBe(true)
    expect(retry(1, err500)).toBe(false)
  })

  it('queryCache onError logout khi 401', () => {
    let captured: ReturnType<typeof useQueryClient> | null = null
    render(
      <ReactQueryProvider>
        <ClientCapture onCapture={(c) => { captured = c }} />
      </ReactQueryProvider>
    )

    captured!.getQueryCache().config.onError?.(
      {
        response: { status: 401, data: { code: '401', message: 'Unauthorized' } },
      } as AxiosError<unknown>,
      { state: {} } as never
    )

    expect(mockLogout).toHaveBeenCalled()
  })

  it('queryCache onError skip toast cho 404 khi đã có data', () => {
    const { toast } = require('sonner')
    let captured: ReturnType<typeof useQueryClient> | null = null

    render(
      <ReactQueryProvider>
        <ClientCapture onCapture={(c) => { captured = c }} />
      </ReactQueryProvider>
    )

    captured!.getQueryCache().config.onError?.(
      {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      } as AxiosError<unknown>,
      { state: { data: { cached: true } } } as never
    )

    expect(toast.error).not.toHaveBeenCalled()
  })

  it('queryCache onError toast message cho lỗi >= 400 khác 401', () => {
    const { toast } = require('sonner')
    let captured: ReturnType<typeof useQueryClient> | null = null

    render(
      <ReactQueryProvider>
        <ClientCapture onCapture={(c) => { captured = c }} />
      </ReactQueryProvider>
    )

    captured!.getQueryCache().config.onError?.(
      {
        response: {
          status: 500,
          data: { code: '500', message: 'Server error', error: 'Server error' },
        },
      } as AxiosError<unknown>,
      { state: { data: { cached: true } } } as never
    )

    expect(toast.error).toHaveBeenCalledWith('Server error')
  })

  it('queryCache onError không làm gì khi không có statusCode', () => {
    const { toast } = require('sonner')
    let captured: ReturnType<typeof useQueryClient> | null = null

    render(
      <ReactQueryProvider>
        <ClientCapture onCapture={(c) => { captured = c }} />
      </ReactQueryProvider>
    )

    captured!.getQueryCache().config.onError?.(
      {} as AxiosError<unknown>,
      { state: { data: undefined } } as never
    )

    expect(mockLogout).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
  })
})