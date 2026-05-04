'use client'

import type { FaqCategory } from '@/services/support/support.schema'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/share/ui/accordion'
import { useCheckLocale } from '@/share/hooks/use-check-locale'
import { pickLocales } from '@/share/lib/locale'

type FaqCategoryProps = Readonly<{
  category: FaqCategory
}>

export function FaqCategory({ category }: FaqCategoryProps) {
  const isVi = useCheckLocale('vi')
  const { categoryNameVi, categoryNameEn, faqArticle: items } = category

  if (items.length === 0) return null

  const label = pickLocales(
    { categoryNameVi, categoryNameEn },
    'categoryName',
    isVi,
  )

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <h2 className="text-headline-lg-mobile text-black md:pt-6 md:col-span-1">
        {label}
      </h2>
      <Accordion type="multiple" className="md:col-span-2">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>
              {pickLocales(item, 'articleTitle', isVi)}
            </AccordionTrigger>
            <AccordionContent>
              <p className="whitespace-pre-wrap">
                {pickLocales(item, 'description', isVi)}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
