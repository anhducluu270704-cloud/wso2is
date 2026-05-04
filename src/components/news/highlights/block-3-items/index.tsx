'use client'

import Image from 'next/image'
import { useLocale } from 'next-intl'
import type { NewsItem } from '@/services/news/news.schema'
import { getNewsDisplayFields } from '@/services/news/news-display'
import { useHighlightClick } from '../hook/use-highlight-click'

type Props = { items: NewsItem[] }

export function HighlightBlock3Items({ items }: Readonly<Props>) {
  return (
    <div className="grid grid-cols-1 gap-6 rounded-xl bg-white md:grid-cols-3">
      {items.map((item) => (
        <HighlightGridCard key={item.id} item={item} />
      ))}
    </div>
  )
}

function HighlightGridCard({ item }: Readonly<{ item: NewsItem }>) {
  const locale = useLocale()
  const { onClick } = useHighlightClick(item.id)
  const { title, dateLabel, imageUrl } = getNewsDisplayFields(item, locale)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full flex-col gap-5 overflow-hidden cursor-pointer transition-opacity hover:opacity-95"
    >
      <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-xl">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <h3 className="line-clamp-2 text-title-md text-black">{title}</h3>
        <p className="mt-auto text-body-helptext-emphasize text-base leading-normal text-grey-5">
          {dateLabel}
        </p>
      </div>
    </button>
  )
}
