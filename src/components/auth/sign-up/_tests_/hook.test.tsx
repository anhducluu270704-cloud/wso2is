
import React from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import type { BaseSignUpRequest } from '@/services/auth/auth.schema'

import authApi from '@/services/auth/auth.service'

import { useSignUpForm } from '../hook'

const mockReplace = jest.fn()

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}))
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
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
  },
}))
jest.mock('react-google-recaptcha-v3', () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: jest.fn().mockResolvedValue('mock-recaptcha-jwt'),
  }),
}))
jest.mock('@/services/recaptcha/recaptcha.client', () => ({
  verifyRecaptchaOnServer: jest.fn(),
}))

import { verifyRecaptchaOnServer } from '@/services/recaptcha/recaptcha.client'

const validForm: BaseSignUpRequest = {
  full_name: 'Nguyen Van A',
  password: 'Abc12345!',
  confirmPassword: 'Abc12345!',
  account_type: 'DEVELOPER',
  company_name: 'Cong Ty ABC',
  company_email: 'hr@company.com',
  business_type: 'FINANCE',
  phone_number: '09012345678',
  tax_code: '0123456789',
  tnc_accepted: true,
}

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('auth/sign-up/hook', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    ;(authApi.signUp as jest.Mock).mockReset()
    ;(verifyRecaptchaOnServer as jest.Mock).mockReset()
    ;(verifyRecaptchaOnServer as jest.Mock).mockResolvedValue({
      ok: true,
      data: { success: true as const },
    })
  })

  it('signUpForm có defaultValues mặc định', () => {
    const { result } = renderHook(() => useSignUpForm(), { wrapper })

    expect(result.current.signUpForm.getValues()).toMatchObject({
      account_type: 'DEVELOPER',
      business_type: 'FINANCE',
      tnc_accepted: false,
    })
  })

  it('handleFormSubmit: khi API trả token thì router.replace tới signup?token=', async () => {
    ;(authApi.signUp as jest.Mock).mockResolvedValue({
      message: 'OK',
      code: '200',
      data: {
        verifyEmailSent: true,
        status: 'PENDING',
        token: 'invite-token-1',
      },
    })

    const { result } = renderHook(() => useSignUpForm(), { wrapper })

    await act(async () => {
      result.current.signUpForm.reset(validForm)
      await result.current.signUpForm.handleSubmit(result.current.handleFormSubmit)()
    })

    expect(authApi.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        full_name: validForm.full_name,
        company_email: validForm.company_email,
        recaptchaToken: 'mock-recaptcha-jwt',
      }),
    )
    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith(
        '/signup?token=' + encodeURIComponent('invite-token-1'),
      ),
    )
  })

  it('handleFormSubmit: vẫn replace khi token rỗng (theo mutation onSuccess)', async () => {
    ;(authApi.signUp as jest.Mock).mockResolvedValue({
      message: 'OK',
      code: '200',
      data: {
        verifyEmailSent: true,
        status: 'PENDING',
        token: '',
      },
    })

    const { result } = renderHook(() => useSignUpForm(), { wrapper })

    await act(async () => {
      result.current.signUpForm.reset(validForm)
      await result.current.signUpForm.handleSubmit(result.current.handleFormSubmit)()
    })

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/signup?token='))
  })

  it('handleFormSubmit: verify recaptcha lỗi mạng không gọi signUp', async () => {
    ;(verifyRecaptchaOnServer as jest.Mock).mockResolvedValue({
      ok: false,
      reason: 'network',
    })

    const { result } = renderHook(() => useSignUpForm(), { wrapper })

    await act(async () => {
      result.current.signUpForm.reset(validForm)
      await result.current.signUpForm.handleSubmit(result.current.handleFormSubmit)()
    })

    expect(result.current.recaptchaError).toBe('recaptcha.verify_failed')
    expect(authApi.signUp).not.toHaveBeenCalled()
  })

  it('handleFormSubmit: lỗi API không gọi replace', async () => {
    ;(authApi.signUp as jest.Mock).mockRejectedValue(new Error('network'))

    const { result } = renderHook(() => useSignUpForm(), { wrapper })

    await act(async () => {
      result.current.signUpForm.reset(validForm)
      await result.current.signUpForm.handleSubmit(result.current.handleFormSubmit)()
    })

    await waitFor(() => expect(result.current.mutation.isError).toBe(true))
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
