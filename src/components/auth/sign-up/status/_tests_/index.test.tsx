
jest.mock('../hook', () => ({
  useParseToken: jest.fn(),
}))

jest.mock('@/share/layout/end-user/header/hook', () => ({
  useGetUrlLoginMutation: () => ({ mutate: jest.fn() }),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const copy: Record<string, string> = {
      'status.title': 'Join Techcombank Open API',
      'status.description':
        'Great job finishing everything! One last step: open your email and tap the verification link to confirm.',
      'status.button': 'Back to Log in',
    }
    return copy[key] ?? key
  },
}))

import React from 'react'
import { render, screen } from '@testing-library/react'
import SignUpStatus from '../index'

const replace = jest.fn()

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: any) => <a href={href}>{children}</a>,
  useRouter: () => ({ replace: replace }),
}))
jest.mock('@/share/ui/button', () => ({
  Button: ({ children, asChild }: any) =>
    asChild ? <>{children}</> : <button>{children}</button>,
}))
jest.mock('@/share/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}))
jest.mock('@/share/icons', () => ({
  ToastSuccess: () => <span>ToastSuccess</span>,
}))
jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading</div>,
}))

const { useParseToken } = require('../hook')

describe('auth/sign-up/status', () => {
  beforeEach(() => {
    replace.mockClear()
    useParseToken.mockReset()
  })

  it('render loading khi đang parse token', () => {
    useParseToken.mockReturnValue({
      isLoading: true,
      error: null,
      isSuccess: false,
    })
    render(<SignUpStatus token="t" />)
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('khi parse token lỗi: gọi replace /signup', () => {
    useParseToken.mockReturnValue({
      isLoading: false,
      error: new Error('bad'),
      isSuccess: false,
    })
    render(<SignUpStatus token="t" />)
    expect(replace).toHaveBeenCalledWith('/signup')
  })

  it('render nội dung thành công khi parse token OK và status PENDING', () => {
    useParseToken.mockReturnValue({
      isLoading: false,
      error: null,
      isSuccess: true,
      data: {
        message: 'OK',
        code: '200',
        data: { status: 'PENDING' },
      },
    })
    render(<SignUpStatus token="t" />)
    expect(screen.getByText('Join Techcombank Open API')).toBeInTheDocument()
    expect(
      screen.getByText(/Great job finishing everything/),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Back to Log in/i }),
    ).toBeInTheDocument()
  })
})
