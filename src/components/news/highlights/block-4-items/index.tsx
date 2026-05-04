'use client'

import Image from 'next/image'
import { useLocale } from 'next-intl'
import type { NewsItem } from '@/services/news/news.schema'
import { getNewsDisplayFields } from '@/services/news/news-display'
import { useHighlightClick } from '../hook/use-highlight-click'

type Props = { items: NewsItem[] }

export function HighlightBlock4Items({ items }: Readonly<Props>) {
  return (
    <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 lg:items-stretch">
      {items[0] && <HighlightBigCard item={items[0]} />}
      <div className="flex h-full min-h-0 flex-col gap-5">
        {items.slice(1).map((item) => (
          <HighlightSmallCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

function HighlightBigCard({ item }: Readonly<{ item: NewsItem }>) {
  const locale = useLocale()
  const { onClick } = useHighlightClick(item.id)
  const { title, dateLabel, imageUrl } = getNewsDisplayFields(item, locale)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-xl text-left bg-white cursor-pointer transition-opacity hover:opacity-95"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-black/40 to-transparent p-5">
          <h3 className="text-title-md text-white">{title}</h3>
          <p className="text-body-helptext-emphasize text-base leading-normal text-white">
            {dateLabel}
          </p>
        </div>
      </div>
    </button>
  )
}

function HighlightSmallCard({ item }: Readonly<{ item: NewsItem }>) {
  const locale = useLocale()
  const { onClick } = useHighlightClick(item.id)
  const { title, dateLabel, imageUrl } = getNewsDisplayFields(item, locale)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-1 gap-5 overflow-hidden rounded-xl text-left bg-white cursor-pointer transition-opacity hover:opacity-95"
    >
      <div className="relative aspect-4/3 w-32 md:w-[140px] lg:aspect-auto lg:h-full lg:w-35 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          sizes="170px"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="line-clamp-2 text-title-md text-black">{title}</h3>
        <p className="mt-auto text-body-helptext-emphasize text-base leading-normal text-grey-5">
          {dateLabel}
        </p>
      </div>
    </button>
  )
}
