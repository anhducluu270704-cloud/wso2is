'use client'

import {
  NewsSectionCard,
  NewsSectionWrapper,
} from '@/components/news/container'
import type { NewsItem } from '@/services/news/news.schema'
import IconButtonShare from '@/share/icons/icon-button-share.svg'
import { useCallback } from 'react'

type NewsDetailContentProps = {
  title: string
  date: string
  content: string
  relatedArticles: NewsItem[]
}

export function NewsDetailContent({
  title,
  date,
  content,
  relatedArticles,
}: Readonly<NewsDetailContentProps>) {
  const handleCopyUrl = useCallback(() => {
    if (typeof window === 'undefined') return
    const url = window.location.href
    void (async () => {
      try {
        await navigator.clipboard.writeText(url)
      } catch {
        /* clipboard denied */
      }
    })()
  }, [])

  return (
    <article className="bg-grey-11">
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <header className="flex items-start justify-between gap-4">
              <h1 className="min-w-0 flex-1 text-3xl font-semibold leading-tight text-black md:text-4xl">
                {title}
              </h1>
              <button
                type="button"
                className="-mr-2 -mt-1 cursor-pointer shrink-0 rounded-full outline-none ring-offset-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-blue-2 focus-visible:ring-offset-2"
                aria-label="Copy page URL"
                onClick={handleCopyUrl}
              >
                <IconButtonShare aria-hidden className="size-11" />
              </button>
            </header>
            <p className="mt-3 text-base text-grey-5">{date}</p>

            {content.trim().length > 0 ? (
              <div
                className="news-detail-body mt-6 max-w-none space-y-4 text-base leading-relaxed text-grey-5 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:my-3 [&_li]:my-1"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : null}
          </div>
        </div>
      </div>

      {relatedArticles.length > 0 && (
        <NewsSectionWrapper
          title="Related articles"
          seeAllLabel="See all"
          background="grey-11"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {relatedArticles.map((item) => (
              <NewsSectionCard key={item.id} item={item} variant="default" />
            ))}
          </div>
        </NewsSectionWrapper>
      )}
    </article>
  )
}
