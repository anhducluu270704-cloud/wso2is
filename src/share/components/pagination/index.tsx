import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/share/ui/pagination'

type PaginationProps = Readonly<{
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}>

const PaginationView = ({
  currentPage,
  totalPages,
  onPageChange,
}: Readonly<PaginationProps>) => {
  const startPage = Math.max(1, Math.min(currentPage - 1, totalPages - 2))
  const endPage = Math.min(totalPages, startPage + 2)
  const pagesAroundCurrent = []
  for (let i = startPage; i <= endPage; i++) {
    pagesAroundCurrent.push(i)
  }
  if (totalPages <= 0) return null

  return (
    <>
      <div className="text-body-body text-grey-5">
        {currentPage} / {totalPages}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            text=""
          />
          {currentPage > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {pagesAroundCurrent.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            text=""
          />
        </PaginationContent>
      </Pagination>
    </>
  )
}

export default PaginationView
