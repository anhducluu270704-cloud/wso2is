import React from 'react'
import { render, waitFor } from '@testing-library/react'

jest.mock('react-google-recaptcha-v3', () => ({
  GoogleReCaptchaProvider: ({
    children,
  }: {
    children: React.ReactNode
  }) => <div data-testid="google-recaptcha-provider">{children}</div>,
}))

import { AuthRecaptchaProvider } from '../recaptcha-provider'

const BODY_CLASS = 'recaptcha-signup-route'

describe('providers/recaptcha-provider', () => {
  const prevEnv = (window as unknown as { __ENV__?: Record<string, string> })
    .__ENV__

  beforeEach(() => {
    ;(window as unknown as { __ENV__: Record<string, string> }).__ENV__ = {
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: 'test-site-key',
    }
  })

  afterEach(() => {
    document.body.classList.remove(BODY_CLASS)
    ;(window as unknown as { __ENV__?: Record<string, string> }).__ENV__ =
      prevEnv
  })

  it('mount: thêm class body cho layout signup; unmount: gỡ class', async () => {
    const { unmount, findByTestId } = render(
      <AuthRecaptchaProvider>
        <span>child</span>
      </AuthRecaptchaProvider>,
    )

    expect(await findByTestId('google-recaptcha-provider')).toBeInTheDocument()
    await waitFor(() => {
      expect(document.body.classList.contains(BODY_CLASS)).toBe(true)
    })

    unmount()

    expect(document.body.classList.contains(BODY_CLASS)).toBe(false)
  })

  it('khi thiếu site key: không bọc GoogleReCaptchaProvider, vẫn render children', async () => {
    ;(window as unknown as { __ENV__: Record<string, string> }).__ENV__ = {}

    const { queryByTestId, findByText } = render(
      <AuthRecaptchaProvider>
        <span>only-child</span>
      </AuthRecaptchaProvider>,
    )

    expect(queryByTestId('google-recaptcha-provider')).toBeNull()
    expect(await findByText('only-child')).toBeInTheDocument()
    await waitFor(() => {
      expect(document.body.classList.contains(BODY_CLASS)).toBe(true)
    })
  })
})
