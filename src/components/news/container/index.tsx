'use client'

import { Link } from '@/i18n/navigation'
import { Button } from '@/share/ui/button'
import type { ReactNode } from 'react'
import {
  NewsSectionCard,
  type NewsSectionCardItem,
} from './card'

export type { NewsSectionCardItem }
export { NewsSectionCard }

type NewsSectionWrapperProps = {
  title: string
  seeAllLabel?: string
  seeAllHref?: string
  background?: 'grey-11'
  children: ReactNode
}

export function NewsSectionWrapper({
  title,
  seeAllLabel = 'See all',
  seeAllHref,
  background,
  children,
}: Readonly<NewsSectionWrapperProps>) {
  return (
    <div
      className={`flex flex-1 flex-col h-full py-16 ${background === 'grey-11' ? 'bg-grey-11' : ''}`}
    >
      <div className="container mx-auto">
        <section className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-headline-lg-mobile text-black">{title}</h2>
            {seeAllHref ? (
              <Button
                asChild
                variant="outline"
                linked
                className="hidden !text-body-label !text-[17px] text-black-1 md:inline-flex items-center gap-2 hover:no-underline hover:opacity-90"
              >
                <Link href={seeAllHref}>
                  {seeAllLabel}
                  <span aria-hidden>→</span>
                </Link>
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                linked
                className="hidden !text-body-label !text-[17px] text-black-1 md:inline-flex items-center gap-2 hover:no-underline hover:opacity-90"
              >
                {seeAllLabel}
                <span aria-hidden>→</span>
              </Button>
            )}
          </div>
          {children}
        </section>
      </div>
    </div>
  )
}
