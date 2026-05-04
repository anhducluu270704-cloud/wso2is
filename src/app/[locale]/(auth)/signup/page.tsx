import SignUpWrapper from '@/components/auth/sign-up'
import SignUpStatusWrapper from '@/components/auth/sign-up/status'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Signup',
  description: '',
}
export default async function SignupPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    token?: string
  }>
}>) {
  const { token } = await searchParams
  const trimmed = token?.trim()

  if (trimmed) {
    return <SignUpStatusWrapper token={trimmed} />
  }

  return <SignUpWrapper />
}
