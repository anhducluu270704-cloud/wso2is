'use client'

import LoadingPage from '@/share/components/full-page/loading'
import { useAuth } from '@/providers/auth-provider'
import { useGetTokenMutation } from '@/services/auth/auth.mutations'
import { useLocale } from 'next-intl'
import { useEffect, useRef } from 'react'

type GetTokenWrapperProps = Readonly<{
  code: string
}>
function GetTokenWrapper(props: GetTokenWrapperProps) {
  const { isLoading } = useAuth()
  if (isLoading) return <LoadingPage />
  return <GetToken {...props} />
}

function GetToken(props: Readonly<GetTokenWrapperProps>) {
  const locale = useLocale()
  const redirectUri = `${window.location.origin}/${locale}/get-token`
  const { code } = props
  const mutation = useGetTokenMutation()
  const didRequestRef = useRef(false)

  useEffect(() => {
    if (didRequestRef.current) return
    didRequestRef.current = true

    mutation.mutate({
      code,
      redirect_uri: redirectUri,
    })
  }, [code, redirectUri, mutation])

  return <LoadingPage />
}

export default GetTokenWrapper
