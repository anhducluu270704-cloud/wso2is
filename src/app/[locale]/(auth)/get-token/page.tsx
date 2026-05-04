import GetTokenWrapper from '@/components/auth/get-token'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Get Token',
  description: '',
}
export default async function GetTokenPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    code?: string
  }>
}>) {
  const { code } = await searchParams

  if (!code) {
    return notFound()
  }
  return <GetTokenWrapper code={code} />
}
