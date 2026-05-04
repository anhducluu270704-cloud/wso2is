'use client'

import type { FaqCategory } from '@/services/support/support.schema'
import { FaqCategory as FaqCategorySection } from './faq-category'

type FaqListProps = Readonly<{
  categories: FaqCategory[]
}>

export function FaqList({ categories }: FaqListProps) {
  return (
    <div className="flex flex-col gap-12">
      {categories.map((cat) =>
        cat.faqArticle.length > 0 ? (
          <FaqCategorySection key={cat.categoryId} category={cat} />
        ) : null,
      )}
    </div>
  )
}
