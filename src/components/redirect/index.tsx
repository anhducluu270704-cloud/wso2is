'use client'

import { useRouter } from '@/i18n/navigation'
import { useEffect } from 'react'
import LoadingPage from '../../share/components/full-page/loading'

type RedirectHref =
  | string
  | {
      pathname: string
      params?: Record<string, string>
    }

type Props = Readonly<{
  href: RedirectHref
}>

export default function RedirectPage({ href }: Props) {
  const router = useRouter()

  useEffect(() => {
    if (typeof href === 'string') {
      router.replace(href)
    } else {
      router.replace(href.pathname, href.params)
    }
  }, [href, router])

  return <LoadingPage />
}
