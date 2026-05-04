'use client'

import type { GuideNavGroup } from '@/util/guide-nav'
import { useFilter } from '@/providers/filter-provider'
import {
  pickLocales,
} from '@/share/lib/locale'
import { useCheckLocale } from '@/share/hooks/use-check-locale'
import { cn } from '@/share/lib/utils'
import { useSearchParams } from 'next/navigation'
import { Fragment, useEffect, useMemo } from 'react'

export function flatGuideNavIds(groups: readonly GuideNavGroup[]): string[] {
  return groups.flatMap((g) => [g.parent.id, ...g.children.map((c) => c.id)])
}

type GuideSidebarProps = Readonly<{
  groups: readonly GuideNavGroup[]
  activeId: string
  onSelect: (id: string) => void
  sidebarAriaLabel: string
}>

export function GuideSidebar({
  groups,
  activeId,
  onSelect,
  sidebarAriaLabel,
}: GuideSidebarProps) {
  const searchParams = useSearchParams()
  const { updateParam } = useFilter()
  const activeFromUrl = searchParams.get('active')
  const flatVisibleIds = useMemo(() => flatGuideNavIds(groups), [groups])

  useEffect(() => {
    if (flatVisibleIds.length === 0) return
    const canonical =
      activeFromUrl && flatVisibleIds.includes(activeFromUrl)
        ? activeFromUrl
        : flatVisibleIds[0]
    if (canonical && canonical !== activeFromUrl) {
      updateParam('active', canonical)
    }
  }, [activeFromUrl, flatVisibleIds, updateParam])

  const isVi = useCheckLocale('vi')

  return (
    <div
      className="w-full shrink-0 rounded-2xl border border-grey-9 bg-white p-4 md:p-5 lg:max-w-[320px]"
      aria-label={sidebarAriaLabel}
    >
      <div className="flex flex-col">
        {groups.map((group) => (
          <Fragment key={group.parent.id}>
            <button
              type="button"
              onClick={() => onSelect(group.parent.id)}
              className={cn(
                'w-full cursor-pointer text-base font-normal rounded-xl py-3 px-4 text-left  ',
                activeId === group.parent.id
                  ? 'bg-grey-12 text-black-1'
                  : 'text-black-1',
              )}
            >
              {pickLocales(group.parent, 'title', isVi)}
            </button>
            {group.children.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  'w-full cursor-pointer rounded-xl py-3 px-8 text-left text-base font-normal',
                  activeId === item.id
                    ? 'bg-grey-12 text-black-1'
                    : 'text-black-1',
                )}
              >
                {pickLocales(item, 'title', isVi)}
              </button>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
