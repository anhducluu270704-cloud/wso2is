import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/share/ui/empty'

export type ListGridEmptyStateProps = Readonly<{
  searchQuery?: string
  searchLine?: string
  noProductsTitle: string
  noProductsDescription: string
}>

export function ListGridEmptyState({
  searchQuery,
  searchLine,
  noProductsTitle,
  noProductsDescription,
}: ListGridEmptyStateProps) {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="text-body-body text-black-1">
        {searchQuery ? (
          searchLine
        ) : (
          <Empty className="border-none py-16">
            <EmptyHeader>
              <EmptyTitle>{noProductsTitle}</EmptyTitle>
              <EmptyDescription className="text-grey-5">
                {noProductsDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>

      {searchQuery ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-title-md-emphasize! text-black-1 tracking-tight">
            {noProductsTitle}
          </p>
          <p className="text-body-body text-grey-5">{noProductsDescription}</p>
        </div>
      ) : null}
    </div>
  )
}
