
import React from 'react'
import { render, screen } from '@testing-library/react'

import CallbackWrapper from '../index'

const mockUseVerifyToken = jest.fn()

jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-page">Loading</div>,
}))
jest.mock('@/services/auth/auth.query-options', () => ({
  useVerifyToken: (token: string) => mockUseVerifyToken(token),
}))
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => <div data-testid="not-found">not-found</div>),
}))
jest.mock('../expired', () => ({
  __esModule: true,
  default: () => <div data-testid="expired-ui">ExpiredUI</div>,
}))
jest.mock('../verified', () => ({
  __esModule: true,
  default: () => <div data-testid="verified-ui">VerifiedUI</div>,
}))

describe('auth/call-back/index', () => {
  beforeEach(() => {
    mockUseVerifyToken.mockReset()
    const { notFound } = require('next/navigation')
    notFound.mockClear()
  })

  it('loading: render LoadingPage', () => {
    mockUseVerifyToken.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isSuccess: false,
    })

    render(<CallbackWrapper token="t" />)
    expect(screen.getByTestId('loading-page')).toBeInTheDocument()
  })

  it('error: gọi notFound', () => {
    const { notFound } = require('next/navigation')
    mockUseVerifyToken.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('bad'),
      isSuccess: false,
    })

    render(<CallbackWrapper token="t" />)
    expect(notFound).toHaveBeenCalled()
    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })

  it('idle (không loading, không error, chưa success): không render gì', () => {
    mockUseVerifyToken.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      isSuccess: false,
    })

    render(<CallbackWrapper token="t" />)
    expect(screen.queryByTestId('expired-ui')).not.toBeInTheDocument()
    expect(screen.queryByTestId('verified-ui')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading-page')).not.toBeInTheDocument()
  })

  it('success status expired: ExpiredStatus', () => {
    mockUseVerifyToken.mockReturnValue({
      data: { data: { status: 'expired' } },
      isLoading: false,
      error: null,
      isSuccess: true,
    })

    render(<CallbackWrapper token="t" />)
    expect(screen.getByTestId('expired-ui')).toBeInTheDocument()
  })

  it('success status verified: VerifiedStatus', () => {
    mockUseVerifyToken.mockReturnValue({
      data: { data: { status: 'verified' } },
      isLoading: false,
      error: null,
      isSuccess: true,
    })

    render(<CallbackWrapper token="t" />)
    expect(screen.getByTestId('verified-ui')).toBeInTheDocument()
  })

  it('success với status không hỗ trợ: gọi notFound', () => {
    const { notFound } = require('next/navigation')
    mockUseVerifyToken.mockReturnValue({
      data: { data: { status: 'pending' } },
      isLoading: false,
      error: null,
      isSuccess: true,
    })

    render(<CallbackWrapper token="t" />)
    expect(notFound).toHaveBeenCalled()
    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })

  it('useVerifyToken nhận đúng token từ props', () => {
    mockUseVerifyToken.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isSuccess: false,
    })

    render(<CallbackWrapper token="my-token" />)
    expect(mockUseVerifyToken).toHaveBeenCalledWith('my-token')
  })
})
