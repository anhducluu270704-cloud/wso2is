import React from 'react'
import { render, screen } from '@testing-library/react'

import AllRolesLayout from '../layout'

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

describe('app/.../reg-ticket/layout', () => {
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
      <AllRolesLayout>
        <div>x</div>
      </AllRolesLayout>,
    )
    expect(screen.getByTestId('loading-page')).toBeInTheDocument()
  })

  it('render children khi có auth', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      authInfo: { id: 'u' },
    })
    render(
      <AllRolesLayout>
        <div>kid</div>
      </AllRolesLayout>,
    )
    expect(screen.getByText('kid')).toBeInTheDocument()
  })
})
