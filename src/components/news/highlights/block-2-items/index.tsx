'use client'

import type { NewsItem } from '@/services/news/news.schema'
import { HighlightHorizontalCard } from './card'

type Props = { items: NewsItem[] }

export function HighlightBlock2Items({ items }: Readonly<Props>) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 md:gap-6 lg:gap-16">
      {items.map((item) => (
        <HighlightHorizontalCard key={item.id} item={item} />
      ))}
    </div>
  )
}
