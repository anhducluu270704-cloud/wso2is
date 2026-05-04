'use client'

import { flexRender, Row, Table } from '@tanstack/react-table'
import { Empty } from '@/share/icons'
import { cn } from '@/share/lib/utils'
import { Button } from '@/share/ui/button'
import {
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Empty as EmptyView,
} from '@/share/ui/empty'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSortCol,
  Table as UITable,
} from '@/share/ui/table'
import { useTranslations } from 'next-intl'
import PaginationView from '../pagination'

function columnMetaClassName(meta: unknown): string | undefined {
  if (typeof meta === 'string') return meta
  if (
    meta &&
    typeof meta === 'object' &&
    meta !== null &&
    'className' in meta
  ) {
    const c = (meta as { className?: unknown }).className
    return typeof c === 'string' ? c : undefined
  }
  return undefined
}

interface TableProps<TData> {
  table: Table<TData>
  className?: string
  renderExpandedRow?: (props: { row: Row<TData> }) => React.ReactElement
  groupRow?: boolean
  onClickRow?: (row: TData) => void
  isFullWidth?: boolean
  header?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyButtonTitle?: string
  emptyButtonOnClick?: () => void
}

export function TableView<TData>(props: Readonly<TableProps<TData>>) {
  const t = useTranslations('common')
  return (
    <div
      className={cn(
        props.className,
        'bg-white py-8 px-12 rounded-2xl flex flex-col gap-12'
      )}
    >
      {props.table.getRowModel().rows.length > 0 ? (
        <UITable>
          {props.header && (
            <TableHeader>
              {props.table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={columnMetaClassName(
                          header.column.columnDef.meta
                        )}
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                        endIcon={
                          <TableSortCol
                            isShow={header.column.getCanSort()}
                            sort={
                              header.column.getCanSort()
                                ? header.column.getIsSorted() || undefined
                                : undefined
                            }
                          />
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
          )}
          <TableBody>
            {props.table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                className={cn(
                  index % 2 === 0 ? 'bg-grey-11' : 'bg-white',
                  'text-body-body text-black-1'
                )}
                data-state={row.getIsSelected() && 'selected'}
                onClick={() => {
                  if (props.onClickRow) props.onClickRow(row.original)
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      className={columnMetaClassName(
                        cell.column.columnDef.meta
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </UITable>
      ) : (
        <EmptyView className="gap-4 p-0">
          <EmptyHeader>
            <Empty className="size-36" />
          </EmptyHeader>
          <EmptyContent>
            <EmptyTitle>{props.emptyTitle ?? t('table.empty')}</EmptyTitle>
            {props.emptyDescription ? (
              <EmptyDescription className="text-grey-5">
                {props.emptyDescription}
              </EmptyDescription>
            ) : null}
          </EmptyContent>
          {props.emptyButtonOnClick && (
            <Button
              variant="outline"
              size="xs"
              rounded
              onClick={props.emptyButtonOnClick}
            >
              {props.emptyButtonTitle ?? t('table.btn.create')}
            </Button>
          )}
        </EmptyView>
      )}
      {props.table.getPageCount() > 1 && (
        <PaginationView
          onPageChange={(e) => {
            props.table.setPageIndex(e - 1)
          }}
          currentPage={props.table.getState().pagination.pageIndex + 1}
          totalPages={props.table.getPageCount()}
        />
      )}
    </div>
  )
}
