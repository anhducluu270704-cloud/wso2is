import { AuthRecaptchaProvider } from '@/providers/recaptcha-provider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Signup',
  description: '',
}

export default function SignupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthRecaptchaProvider>{children}</AuthRecaptchaProvider>
}
