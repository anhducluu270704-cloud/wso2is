'use client'

import type { NewsItem } from '@/services/news/news.schema'
import { HighlightBlock1Item } from './block-1-item'
import { HighlightBlock2Items } from './block-2-items'
import { HighlightBlock3Items } from './block-3-items'
import { HighlightBlock4Items } from './block-4-items'

type NewsHighlightsProps = {
  items: NewsItem[]
}

export function NewsHighlights({ items }: Readonly<NewsHighlightsProps>) {
  if (items.length === 0) return null

  const latestItems = items.slice(0, 4)

  return (
    <div className="flex flex-1 flex-col h-full py-16">
      <div className="container mx-auto">
        <section className="flex flex-col gap-8">
          <div className="gap-2.5 flex flex-col">
            <h2 className="text-headline-lg-mobile text-black">Highlights</h2>
            <p className="text-body-body text-xl leading-normal text-grey-5">
              From the world of Techcombank Open API
            </p>
          </div>

          {latestItems.length === 1 && (
            <HighlightBlock1Item item={latestItems[0]} />
          )}
          {latestItems.length === 2 && (
            <HighlightBlock2Items items={latestItems} />
          )}
          {(latestItems.length === 3 || latestItems.length >= 5) && (
            <HighlightBlock3Items items={latestItems} />
          )}
          {latestItems.length === 4 && (
            <HighlightBlock4Items items={latestItems} />
          )}
        </section>
      </div>
    </div>
  )
}
