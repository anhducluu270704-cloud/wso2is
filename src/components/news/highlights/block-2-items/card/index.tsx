'use client'

import Image from 'next/image'
import { useLocale } from 'next-intl'
import type { NewsItem } from '@/services/news/news.schema'
import { getNewsDisplayFields } from '@/services/news/news-display'
import { useHighlightClick } from '../../hook/use-highlight-click'

type Props = { item: NewsItem }

export function HighlightHorizontalCard({ item }: Readonly<Props>) {
  const locale = useLocale()
  const { onClick } = useHighlightClick(item.id)
  const { title, dateLabel, imageUrl } = getNewsDisplayFields(item, locale)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-5 overflow-hidden rounded-xl bg-white cursor-pointer transition-opacity md:flex-row md:gap-5"
    >
      <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-xl md:max-w-[240px]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="line-clamp-2 md:line-clamp-3 text-title-md text-black">
          {title}
        </h3>
        <p className="mt-auto text-body-helptext-emphasize text-base leading-normal text-grey-5">
          {dateLabel}
        </p>
      </div>
    </button>
  )
}
