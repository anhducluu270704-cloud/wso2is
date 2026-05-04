'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { useEffect, useState } from 'react'

export function AuthRecaptchaProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [siteKey, setSiteKey] = useState('')

  useEffect(() => {
    document.body.classList.add('recaptcha-signup-route')

    setSiteKey(window.__ENV__?.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '')

    return () => {
      document.body.classList.remove('recaptcha-signup-route')
    }
  }, [])

  // Chưa đọc xong env (lần render đầu): tránh báo lỗi giả — key được set trong effect sau cùng
  if (!siteKey) {
    return <>{children}</>
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{ async: true, defer: true }}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
