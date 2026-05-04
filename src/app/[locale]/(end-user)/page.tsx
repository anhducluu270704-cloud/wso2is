'use client'

import RedirectPage from '@/components/redirect'
import { usePathname } from 'next/navigation'

export default function EUDashboardPage() {
  const pathname = usePathname()
  return (
    <RedirectPage
      href={{
        pathname: '/api-products',
        params: { redirect: pathname },
      }}
    />
  )
}
