
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import authApi from '@/services/auth/auth.service'

import SignUpWrapper from '../index'

jest.mock('@/share/components/input/captcha', () => ({
  __esModule: true,
  default: ({ name, label, register }: any) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} data-testid="captcha-input" {...register(name)} />
    </div>
  ),
}))

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}))

jest.mock('next-intl', () => ({
  useLocale: () => 'vi',
  useTranslations: (ns?: string) => (key: string) =>
    ns ? `${ns}.${key}` : key,
}))

jest.mock('sonner', () => ({
  toast: {
    dismiss: jest.fn(),
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('@/services/auth/auth.service', () => ({
  __esModule: true,
  default: {
    signUp: jest.fn(),
    signIn: jest.fn(),
  },
}))

function renderSignUp() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <SignUpWrapper />
    </QueryClientProvider>,
  )
}

describe('auth/sign-up/index', () => {
  beforeEach(() => {
    ;(authApi.signUp as jest.Mock).mockReset()
    ;(authApi.signUp as jest.Mock).mockResolvedValue({
      message: 'OK',
      code: '200',
      data: {
        verifyEmailSent: true,
        status: 'PENDING',
        token: 't',
      },
    })
  })

  it('render title, nút đăng ký và nút đăng nhập (ghost)', () => {
    renderSignUp()

    expect(
      screen.getByRole('heading', { name: 'signup.form.title' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'signup.btn.signup' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'signup.btn.login' }),
    ).toBeInTheDocument()
  })

  it('focus ô password hiển thị danh sách signup.rules', async () => {
    const user = userEvent.setup()
    const { container } = renderSignUp()

    const passwordInput = container.querySelector('input[name="password"]')
    expect(passwordInput).toBeTruthy()

    await user.click(passwordInput as HTMLInputElement)

    expect(screen.getByText('signup.rules.length')).toBeInTheDocument()
    expect(screen.getByText('signup.rules.upper')).toBeInTheDocument()
  })
})
