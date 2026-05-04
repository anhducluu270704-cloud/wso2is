import { Link, usePathname } from '@/i18n/navigation'
import { ChevronDown } from '@/share/icons'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/share/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/share/ui/dropdown-menu'
import { EUHeaderItems } from './items'
import { isHeaderNavRouteActive } from '../../../../util/route-active'
import { cn } from '@/share/lib/utils'
import { useTranslations } from 'next-intl'

export function EUHeaderListItems() {
  const pathname = usePathname()
  const t = useTranslations('layout.header')

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {EUHeaderItems.map((item) => (
          <NavigationMenuItem key={item.url}>
            {item.subItems?.length ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'inline-flex h-16 items-center justify-center gap-1 px-9 py-2 rounded-none bg-background',
                    item.subItems.some((sub) =>
                      isHeaderNavRouteActive(pathname, sub.url),
                    ) && 'bg-muted font-medium',
                  )}
                >
                  <span>
                    {t.has(item.title) ? t(item.title) : item.title}
                  </span>
                  <ChevronDown className="!stroke-2 size-3 shrink-0 text-black-2" aria-hidden />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-40">
                  {item.subItems.map((sub) => (
                    <DropdownMenuItem
                      key={sub.url}
                      asChild
                      variant={
                        isHeaderNavRouteActive(pathname, sub.url)
                          ? 'selected'
                          : 'default'
                      }
                    >
                      <Link href={sub.url}>
                        {t.has(sub.title) ? t(sub.title) : sub.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  'px-9 h-16 rounded-none'
                )}
                data-active={isHeaderNavRouteActive(pathname, item.url)}
              >
                <Link href={item.url}>
                  {t.has(item.title) ? t(item.title) : item.title}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
