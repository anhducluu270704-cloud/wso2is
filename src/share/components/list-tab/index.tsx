'use client'

import { ListItem } from '@/models/ui/tabs'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/share/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/share/ui/tabs'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ListTab({
  listItems,
  className,
}: Readonly<{
  listItems: ListItem
  className?: string
}>) {
  const t = useTranslations('application')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const contentItems = listItems.filter((item) => item.content != null)
  const selectableValues = new Set(contentItems.map((item) => item.value))
  const defaultActive = contentItems[0]?.value
  const resolveTabValue = (value?: string) => {
    if (!value) return undefined
    if (selectableValues.has(value)) return value
    return undefined
  }

  const activeFromQuery = resolveTabValue(
    searchParams.get('active') ?? undefined
  )
  const [activeTab, setActiveTab] = useState(activeFromQuery ?? defaultActive)

  /* eslint-disable react-hooks/set-state-in-effect -- keep Tabs in sync when ?active= changes (Next searchParams) */
  useEffect(() => {
    const nextActiveTab = activeFromQuery ?? defaultActive
    if (!nextActiveTab) return
    if (nextActiveTab === activeTab) return
    setActiveTab(nextActiveTab)
  }, [activeFromQuery, defaultActive, activeTab])
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        const nextValue = resolveTabValue(value)
        if (!nextValue) return
        setActiveTab(nextValue)
        const params = new URLSearchParams(searchParams.toString())
        params.set('active', nextValue)
        const nextQuery = params.toString()
        router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname)
      }}
      orientation="vertical"
      className={cn(className)}
    >
      <TabsList className="min-w-[320px]!">
        {listItems.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.value}
            disabled={resolveTabValue(item.value) == null}
            className={cn(item.isActive === false && 'bg-transparent!')}
          >
            <span className="w-6 h-6">{item.icon}</span>
            {t(item.label)}
          </TabsTrigger>
        ))}
      </TabsList>
      {contentItems.map((item) => (
        <TabsContent key={item.id} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
