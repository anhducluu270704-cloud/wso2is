import { ChevronDown, ChevronUp } from '@/share/icons'
import { Button } from '@/share/ui/button'
import { SpinnerCustom } from '@/share/ui/spinner'
import { useTranslations } from 'next-intl'

type PaginationGridProps = {
  hasLoadMore: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  onLoadLess?: () => void
}

export function PaginationGrid({
  hasLoadMore,
  isFetchingNextPage,
  onLoadMore,
  onLoadLess,
}: Readonly<PaginationGridProps>) {
  const t = useTranslations('common')

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {hasLoadMore && (
        <Button
          type="button"
          variant="secondary"
          linked
          onClick={onLoadMore}
          className="min-h-11"
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <SpinnerCustom className="py-0" />
          ) : (
            <ChevronDown className="text-black-1! stroke-2!" />
          )}
          {t('btn.load_more')}
        </Button>
      )}
      {onLoadLess && (
        <Button
          type="button"
          variant="secondary"
          linked
          onClick={onLoadLess}
          className="min-h-11"
        >
          <ChevronUp className="text-black-1! stroke-2!" />
          {t('btn.collapse')}
        </Button>
      )}
    </div>
  )
}
