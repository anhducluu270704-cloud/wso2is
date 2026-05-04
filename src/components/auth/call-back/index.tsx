'use client'

import LoadingPage from '@/share/components/full-page/loading'
import { useVerifyToken } from '@/services/auth/auth.query-options'
import { notFound } from 'next/navigation'
import ExpiredStatus from './expired'
import VerifiedStatus from './verified'

export default function CallbackWrapper({
  token,
}: Readonly<{ token: string }>) {
  const { data, isLoading, error, isSuccess } = useVerifyToken(token)

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return notFound()
  }

  if (isSuccess) {
    return <Callback status={data.data.status} />
  }
}

function Callback({ status }: Readonly<{ status: string }>) {
  switch (status) {
    case 'expired':
      return <ExpiredStatus />
    case 'verified':
      return <VerifiedStatus />
    default:
      return notFound()
  }
}

export { default as ExpiredStatus } from './expired'
export { default as VerifiedStatus } from './verified'
