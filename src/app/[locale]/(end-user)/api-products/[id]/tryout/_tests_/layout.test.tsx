import React from 'react'
import { render, screen } from '@testing-library/react'

import TryoutLayout from '../layout'

const mutateFn = jest.fn()

jest.mock('@/providers/auth-provider', () => ({
  useAuth: jest.fn(),
}))

jest.mock('@/share/layout/end-user/header/hook', () => ({
  useGetUrlLoginMutation: jest.fn(() => ({
    mutate: mutateFn,
  })),
}))

jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-page" />,
}))

describe('app/.../tryout/layout', () => {
  const { useAuth } = jest.requireMock('@/providers/auth-provider')

  beforeEach(() => {
    mutateFn.mockClear()
    ;(useAuth as jest.Mock).mockReset()
  })

  it('LoadingPage khi isLoading', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isLoading: true,
      authInfo: null,
    })
    render(
      <TryoutLayout>
        <div>child</div>
      </TryoutLayout>,
    )
    expect(screen.getByTestId('loading-page')).toBeInTheDocument()
  })

  it('gọi mutate khi chưa đăng nhập', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      authInfo: null,
    })
    render(
      <TryoutLayout>
        <span>c</span>
      </TryoutLayout>,
    )
    expect(mutateFn).toHaveBeenCalled()
    expect(screen.getByText('c')).toBeInTheDocument()
  })

  it('vẫn gọi mutate để lấy login url khi đã có authInfo', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      authInfo: { token: 't' },
    })
    render(
      <TryoutLayout>
        <span>c</span>
      </TryoutLayout>,
    )
    expect(mutateFn).toHaveBeenCalledTimes(1)
  })
})
