'use client'

import { LOGO_REDIRECT } from '@/constants/system'
import { Link, usePathname } from '@/i18n/navigation'
import { useAuthSession } from '@/providers/auth-session-provider'
import LocalesDropdown from '@/share/components/language-switch.tsx'
import UserDropdown from '@/share/components/user-dropdown.tsx'
import { cn } from '@/share/lib/utils'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/share/ui/drawer'
import { ArrowRight, Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useGetUrlLoginMutation } from './hook'
import { EUHeaderItems } from './items'
import { EUHeaderListItems } from './list-items'
import { isHeaderNavRouteActive } from '../../../../util/route-active'

const LOGOMARK_SRC = '/images/logo/Techcombank_logomark.svg'

function MobileDrawerContent({ pathname }: Readonly<{ pathname: string }>) {
  const t = useTranslations('layout.header')

  return (
    <>
      <DrawerHeader className="p-0 border-b">
        <DrawerTitle className="sr-only">Menu</DrawerTitle>
      </DrawerHeader>
      <nav className="flex flex-col pt-6 pb-15  overflow-auto">
        {EUHeaderItems.map((item) =>
          item.subItems?.length ? (
            <div key={item.url} className="flex flex-col">
              <span className="px-5 pb-3 pt-2 text-xs font-semibold uppercase leading-snug tracking-wide text-grey-5">
                {t.has(item.title) ? t(item.title) : item.title}
              </span>
              {item.subItems.map((sub) => (
                <div key={sub.url} className="flex flex-col">
                  <DrawerClose asChild>
                    <Link
                      href={sub.url}
                      className={cn(
                        'py-5 text-body-body px-5 pl-10 hover:bg-muted',
                        isHeaderNavRouteActive(pathname, sub.url) &&
                        'bg-muted font-medium'
                      )}
                    >
                      {t.has(sub.title) ? t(sub.title) : sub.title}
                    </Link>
                  </DrawerClose>
                  <div className="h-px w-full bg-grey-3" aria-hidden />
                </div>
              ))}
            </div>
          ) : (
            <div key={item.url} className="flex flex-col">
              <DrawerClose asChild>
                <Link
                  href={item.url}
                  className={cn(
                    'py-6 text-body-body px-5 hover:bg-muted',
                    isHeaderNavRouteActive(pathname, item.url) && 'bg-muted font-medium'
                  )}
                >
                  {t.has(item.title) ? t(item.title) : item.title}
                </Link>
              </DrawerClose>
              <div className="h-px w-full bg-grey-3" aria-hidden />
            </div>
          )
        )}
        <div className="px-5 pt-6 [&_button]:p-0 [&_button]:h-auto [&_button]:min-h-0 [&_button_svg]:text-black [&_button_svg]:size-4">
          <LocalesDropdown showLabel showGlobeIcon alignDropdown="start" />
        </div>
      </nav>
    </>
  )
}

export default function EUHeader() {
  const t = useTranslations('layout')
  const pathname = usePathname()
  const { authSession } = useAuthSession()
  const mutate = useGetUrlLoginMutation()

  return (
    <header
      className={cn(
        'fixed top-0 w-full bg-white z-100 lg:px-0',
        'h-[85px] lg:h-[64px]'
      )}
    >
      <div className="flex flex-1 h-full justify-between items-center container mx-auto">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src={LOGOMARK_SRC}
            alt="Techcombank"
            height={24}
            width={35}
            className="block lg:hidden"
          />
          <Image
            src={LOGO_REDIRECT}
            alt="Techcombank"
            height={28}
            width={204}
            className="hidden lg:block"
          />
        </Link>
        <div className="hidden lg:block">
          <EUHeaderListItems />
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:block">
            <LocalesDropdown showLabel />
          </div>
          {authSession ? (
            <>
              <UserDropdown />
              <div className="flex lg:hidden items-center">
                <span
                  className="h-5 w-px bg-grey-3 flex-shrink-0"
                  aria-hidden
                />
                <Drawer direction="left">
                  <DrawerTrigger asChild>
                    <button
                      type="button"
                      className="flex h-10 min-w-10 items-center justify-center rounded-md hover:bg-muted pl-4 pr-2"
                      aria-label="Open menu"
                    >
                      <Menu className="size-6 shrink-0 text-black-2" />
                    </button>
                  </DrawerTrigger>
                  <DrawerContent
                    className={cn(
                      '!mt-0 rounded-none border-l border-r-0 border-t-0 border-b-0',
                      'data-[vaul-drawer-direction=left]:!top-16 data-[vaul-drawer-direction=left]:!bottom-0 data-[vaul-drawer-direction=left]:!h-[calc(100vh-4rem)]',
                      'data-[vaul-drawer-direction=left]:!w-full data-[vaul-drawer-direction=left]:!max-w-full data-[vaul-drawer-direction=left]:sm:!max-w-full data-[vaul-drawer-direction=left]:!left-0 data-[vaul-drawer-direction=left]:!rounded-none'
                    )}
                  >
                    <MobileDrawerContent pathname={pathname} />
                  </DrawerContent>
                </Drawer>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => mutate.mutate()}
                className="bg-red-3 px-4 py-2.5 h-16 items-center gap-2.5 text-body-body text-white cursor-pointer transition-all duration-150 hover:bg-black hidden lg:flex"
              >
                {t('header.login')}
                <ArrowRight className="size-6" />
              </button>
              <div className="flex lg:hidden items-center">
                <button
                  onClick={() => mutate.mutate()}
                  className="text-red-3 text-body-label leading-[21px] tracking-[2px] uppercase hover:opacity-80 p-8"
                >
                  {t('header.login')}
                </button>
                <span
                  className="h-5 w-px bg-grey-3 flex-shrink-0"
                  aria-hidden
                />
                <Drawer direction="left">
                  <DrawerTrigger asChild>
                    <button
                      type="button"
                      className="flex h-10 min-w-10 items-center justify-center rounded-md hover:bg-muted pl-8"
                      aria-label="Open menu"
                    >
                      <Menu className="size-6 shrink-0 text-black-2" />
                    </button>
                  </DrawerTrigger>
                  <DrawerContent
                    className={cn(
                      '!mt-0 rounded-none border-l border-r-0 border-t-0 border-b-0',
                      'data-[vaul-drawer-direction=left]:!top-[85px] data-[vaul-drawer-direction=left]:!bottom-0 data-[vaul-drawer-direction=left]:!h-[calc(100vh-85px)]',
                      'data-[vaul-drawer-direction=left]:!w-full data-[vaul-drawer-direction=left]:!max-w-full data-[vaul-drawer-direction=left]:sm:!max-w-full data-[vaul-drawer-direction=left]:!left-0 data-[vaul-drawer-direction=left]:!rounded-none'
                    )}
                  >
                    <MobileDrawerContent pathname={pathname} />
                  </DrawerContent>
                </Drawer>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
