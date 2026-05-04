'use client'

import { LOCALES_LIST_PLUS } from '@/constants/locales'
import { LOCALES_CHANNEL } from '@/constants/system'
import { usePathname, useRouter } from '@/i18n/navigation'
import { ChevronDown, Public } from '@/share/icons'
import { cn } from '@/share/lib/utils'
import { Button } from '@/share/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/share/ui/dropdown-menu'
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function LocalesDropdown({
  showLabel = false,
  showGlobeIcon = false,
  alignDropdown = 'end',
}: Readonly<{
  showLabel?: boolean
  showGlobeIcon?: boolean
  alignDropdown?: 'center' | 'end' | 'start'
}>) {
  const currentLocale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const router = useRouter()
  const channelRef = useRef<BroadcastChannel | null>(null)

  const pathnameWithSearch = searchParams?.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname

  useEffect(() => {
    channelRef.current = new BroadcastChannel(LOCALES_CHANNEL)

    channelRef.current.onmessage = (event) => {
      const locale = event.data
      router.replace(pathnameWithSearch, { locale })
    }

    return () => {
      channelRef.current?.close()
    }
  }, [pathnameWithSearch, router])

  const changeLanguage = (locale: string) => {
    channelRef.current?.postMessage(locale)
    router.replace(pathnameWithSearch, { locale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size={showLabel ? 'default' : 'icon'}
          className={cn(
            'text-body-body h-16 rounded-none',
            showGlobeIcon && 'text-4 leading-4'
          )}
        >
          {showLabel && (
            <div
              className={cn(
                'flex gap-2 items-center',
                showGlobeIcon && 'text-4 leading-4'
              )}
            >
              {showGlobeIcon && (
                <Public className="size-5 shrink-0 [&_path]:fill-current" />
              )}
              <span>
                {LOCALES_LIST_PLUS.find((e) => e.key === currentLocale)?.name}
              </span>
            </div>
          )}
          <ChevronDown className="!stroke-2 !text-black-2 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={alignDropdown}>
        {LOCALES_LIST_PLUS.map((e) => (
          <DropdownMenuItem
            key={e.key}
            onClick={() => changeLanguage(e.key)}
            variant={currentLocale === e.key ? 'selected' : 'default'}
          >
            {e.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
