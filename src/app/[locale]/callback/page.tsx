import CallbackWrapper from '@/components/auth/call-back'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Callback',
  description: '',
}
export default async function CallbackPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    token?: string
  }>
}>) {
  const { token } = await searchParams
  const trimmed = token?.trim()

  if (!trimmed) {
    return notFound()
  }
  return <CallbackWrapper token={trimmed} />
}
