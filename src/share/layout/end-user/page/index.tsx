import React from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { EUPageLayoutProps } from '@/models/ui/layout'
import { cn } from '@/share/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/share/ui/breadcrumb'
import { EUHeaderItems } from '../header/items'
import { useTranslations } from 'next-intl'

export default function EUPageLayout({
  children,
  title,
  description,
  headerImageSrc,
  breadcrumbTrail,
  className,
  background,
}: Readonly<EUPageLayoutProps>) {
  const pathname = usePathname()
  const t = useTranslations('layout.header')
  const getTitleByPath = (
    items: readonly { title: string; url: string }[],
    pathname: string
  ) => {
    const exact = items.find((item) => item.url === pathname)
    if (exact) return exact.title
    const byPrefix = items
      .filter((item) => pathname.startsWith(item.url))
      .sort((a, b) => b.url.length - a.url.length)[0]
    return byPrefix?.title ?? ''
  }

  const breadcrumbLabel = t.has(getTitleByPath(EUHeaderItems, pathname))
    ? t(getTitleByPath(EUHeaderItems, pathname))
    : getTitleByPath(EUHeaderItems, pathname)

  return (
    <div className={cn('flex flex-1 flex-col min-h-screen')}>
      <div
        className={cn(
          `relative overflow-hidden bg-top-right md:bg-center bg-no-repeat bg-cover md:h-[364px] h-[287px]`,
          className
        )}
        style={{
          backgroundImage: headerImageSrc
            ? `url(${headerImageSrc})`
            : undefined,
        }}
      >
        <div className={`absolute inset-0 z-1 ${background} md:max-w-2/3`} />
        <div className="relative flex flex-1 items-center h-full container mx-auto">
          <div className="relative pt-[85px] md:pt-16 z-10 overflow-hidden flex flex-1 h-full max-w-[522px] flex-col item-end md:items-start justify-end md:justify-center gap-[10px] py-[26px] md:py-0">
            <Breadcrumb className="absolute top-20 left-0 z-10 hidden md:block">
              <BreadcrumbList>
                <BreadcrumbItem>{t('home')}</BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbTrail && breadcrumbTrail.length > 0 ? (
                  <>
                    {breadcrumbTrail.map((item, index) => (
                      <React.Fragment key={item.href ?? item.label}>
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                          {item.href != null ? (
                            <BreadcrumbLink asChild>
                              <Link href={item.href}>{item.label}</Link>
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{breadcrumbLabel}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            <p className="max-w-full md:text-headline-lg-desktop line-clamp-2 text-headline-lg-mobile text-black-1 wrap-break-word">
              {title}
            </p>
            {description && (
              <p className="max-w-full wrap-break-word text-[18px] leading-[27px] text-grey-5 line-clamp-3">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={cn('flex flex-1 flex-col')}>{children}</div>
    </div>
  )
}
