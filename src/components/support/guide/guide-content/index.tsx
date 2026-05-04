'use client'

import type { GuideDocument } from '@/services/support/support.schema'
import { pickLocales } from '@/share/lib/locale'
import { useCheckLocale } from '@/share/hooks/use-check-locale'
import LoadingPage from '@/share/components/full-page/loading'

type GuideMainPanelProps = Readonly<{
  documents: readonly GuideDocument[]
  isLoading?: boolean
}>

export function GuideMainPanel({ documents, isLoading }: GuideMainPanelProps) {
  const isVi = useCheckLocale('vi')

  if (isLoading) {
    return <LoadingPage />
  }

  if (documents.length === 0) {
    return (
      <div
        className="min-h-[120px] min-w-0 flex-1 rounded-2xl border border-grey-9 bg-white p-6 md:p-10"
        aria-hidden
      />
    )
  }

  return (
    <div className="min-w-0 flex-1 rounded-2xl border border-grey-9 bg-white p-6 md:p-10">
      <div className="space-y-10">
        {documents.map((doc) => {
          const title = pickLocales(doc, 'documentTitle', isVi)
          const body = pickLocales(doc, 'description', isVi)

          return (
            <article
              key={doc.id}
              className="space-y-6 text-base leading-7 text-grey-5"
            >
              <h1 className="text-headline-lg-mobile font-semibold text-black-1 md:text-headline-lg-desktop">
                {title}
              </h1>
              {body.trim().length > 0 ? (
                <div
                  className="max-w-none [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:my-3 [&_li]:my-1"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}
