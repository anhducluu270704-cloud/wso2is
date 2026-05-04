'use client'

import { useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import type { NewsItem } from '@/services/news/news.schema'
import { getNewsDisplayFields } from '@/services/news/news-display'

export type NewsSectionCardItem = NewsItem

type NewsSectionCardProps = {
  item: NewsSectionCardItem
  variant?: 'default' | 'bordered'
}

export function NewsSectionCard({
  item,
  variant = 'default',
}: Readonly<NewsSectionCardProps>) {
  const router = useRouter()
  const locale = useLocale()
  const { title, dateLabel, imageUrl } = getNewsDisplayFields(item, locale)

  return (
    <button
      type="button"
      onClick={() => router.push(`/news/${item.id}`)}
      className={
        variant === 'bordered'
          ? 'group flex h-full flex-col gap-5 overflow-hidden rounded-xl bg-white cursor-pointer'
          : 'group flex h-full flex-col text-left gap-5 overflow-hidden rounded-xl cursor-pointer'
      }
    >
      <div className="relative aspect-4/3 w-full shrink-0 rounded-xl overflow-hidden bg-grey-11">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div
        className={
          variant === 'bordered'
            ? 'flex flex-1 flex-col gap-2 px-5 py-4'
            : 'flex flex-1 flex-col gap-2'
        }
      >
        <h3 className="line-clamp-2 text-title-md leading-[30px] text-black">
          {title}
        </h3>
        <p className="mt-auto text-body-helptext-emphasize text-[16px] leading-6 text-grey-5">
          {dateLabel}
        </p>
      </div>
    </button>
  )
}
