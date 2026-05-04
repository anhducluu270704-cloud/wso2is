'use client'

import Image from 'next/image'
import { useLocale } from 'next-intl'
import type { NewsItem } from '@/services/news/news.schema'
import { getNewsDisplayFields } from '@/services/news/news-display'
import { useHighlightClick } from '../hook/use-highlight-click'

type Props = { item: NewsItem }

export function HighlightBlock1Item({ item }: Readonly<Props>) {
  const locale = useLocale()
  const { onClick } = useHighlightClick(item.id)
  const { title, description, dateLabel, imageUrl } =
    getNewsDisplayFields(item, locale)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-5 rounded-xl bg-white cursor-pointer transition-opacity hover:opacity-95 md:flex-row md:items-stretch md:gap-5"
    >
      <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-xl md:max-w-[50%]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-col justify-center gap-1">
        <h3 className="text-title-md text-black">{title}</h3>
        <p className="line-clamp-3 text-headline-md-mobile text-sm leading-normal text-grey-5">
          {description}
        </p>
        <p className="text-body-helptext-emphasize text-base text-grey-5">
          {dateLabel}
        </p>
      </div>
    </button>
  )
}
