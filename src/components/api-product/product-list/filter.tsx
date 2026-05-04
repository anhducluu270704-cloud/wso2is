import { ApiCategoryDetail } from '@/services/api-product/apiProduct.schema'
import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/share/ui/button'
import { cn } from '@/share/lib/utils'
import { Filter } from '@/models/api/common'

export function ProductListFilter({
  categoriesData,
  filter,
  updateParam,
}: Readonly<{
  filter: Filter
  updateParam: (key: string, value: string) => void
  categoriesData: ApiCategoryDetail[]
}>) {
  const t = useTranslations('api_product')
  const filterOptions = useMemo(() => {
    const categories = categoriesData ?? []
    if (categories.length <= 1) {
      return []
    }

    const categoryOptions = categories.map((opt) => ({
      value: opt.name,
      label: opt.name,
    }))

    return [{ value: '', label: t('filter.all') }, ...categoryOptions]
  }, [categoriesData, t])

  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map((option) => (
        <Button
          key={option.value}
          variant={
            filter.category === (option.value || undefined)
              ? 'default'
              : 'outline'
          }
          size="lg"
          className={cn(
            'rounded-[33px] px-4 py-2 text-body-body',
            filter.category === option.value
              ? 'bg-grey-1 text-white'
              : 'border-grey-9 text-grey-1'
          )}
          onClick={() => updateParam('category', option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
