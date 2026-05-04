
import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

import VerifiedStatus from '../verified'

const mockLoginMutate = jest.fn()

jest.mock('next-intl', () => ({
  useTranslations:
    () =>
    (key: string, values?: { count?: number }) => {
      if (key === 'callback.verified.countdown' && values?.count != null) {
        const n = values.count
        return n === 1 ? '1 second' : `${n} seconds`
      }
      const copy: Record<string, string> = {
        'callback.verified.title': 'Your account is verified!',
        'callback.verified.redirectlead': "We'll take you to the login page in",
        'callback.verified.redirecttrail': ', or you can',
        'callback.verified.btn.login': 'Log in now',
      }
      return copy[key] ?? key
    },
}))
jest.mock('@/share/layout/end-user/header/hook', () => ({
  useGetUrlLoginMutation: () => ({ mutate: mockLoginMutate, isPending: false }),
}))
jest.mock('@/share/components/full-page/error-layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-layout">{children}</div>
  ),
}))
jest.mock('@/share/icons', () => ({
  VerifySuccess: () => <span data-testid="verify-success-icon" />,
}))
jest.mock('@/share/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}))
jest.mock('@/share/ui/empty', () => ({
  Empty: ({ children }: any) => <div>{children}</div>,
  EmptyContent: ({ children }: any) => <div>{children}</div>,
  EmptyDescription: ({ children }: any) => <p>{children}</p>,
  EmptyHeader: ({ children }: any) => <div>{children}</div>,
  EmptyTitle: ({ children }: any) => <h2>{children}</h2>,
}))

describe('auth/call-back/verified', () => {
  beforeEach(() => {
    mockLoginMutate.mockClear()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('hiển thị countdown và nút Log in now', () => {
    render(<VerifiedStatus />)

    expect(screen.getByText('Your account is verified!')).toBeInTheDocument()
    expect(screen.getByText(/We'll take you to the login page in/)).toBeInTheDocument()
    expect(screen.getByText('3 seconds')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Log in now' })).toBeInTheDocument()
  })

  it('đếm ngược và sau hết thời gian gọi login mutate', () => {
    render(<VerifiedStatus />)

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByText('2 seconds')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(2 * 1000)
    })

    expect(mockLoginMutate).toHaveBeenCalledTimes(1)
  })

  it('Log in now gọi login mutation', () => {
    render(<VerifiedStatus />)

    fireEvent.click(screen.getByRole('button', { name: 'Log in now' }))
    expect(mockLoginMutate).toHaveBeenCalled()
  })
})
