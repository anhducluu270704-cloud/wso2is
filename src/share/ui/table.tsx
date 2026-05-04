'use client'

import * as React from 'react'

import { ENUM_DIR_SORT } from '@/constants/system'
import { cn } from '@/share/lib/utils'
import { ArrowDown, ArrowUp, ArrowUpDown } from '../icons'

function Table({
  children,
  ...props
}: Readonly<React.ComponentProps<'table'>>) {
  return (
    <div data-slot="table-container" className="w-full overflow-x-auto">
      <table
        data-slot="table"
        className="overflow-auto min-w-full relative table-fixed"
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

function TableHeader({
  className,
  ...props
}: Readonly<React.ComponentProps<'thead'>>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-b border-grey-9', className)}
      {...props}
    />
  )
}

function TableBody({
  className,
  ...props
}: Readonly<React.ComponentProps<'tbody'>>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function TableFooter({
  className,
  ...props
}: Readonly<React.ComponentProps<'tfoot'>>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  )
}

function TableRow({
  className,
  ...props
}: Readonly<React.ComponentProps<'tr'>>) {
  return <tr data-slot="table-row" className={cn(className)} {...props} />
}

function TableHead({
  className,
  endIcon,
  ...props
}: Readonly<
  React.ComponentProps<'th'> & {
    endIcon?: React.ReactNode
    /** When true, header label may wrap; inner label loses truncate/nowrap. */
    headerWrap?: boolean
  }
>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'sticky w-full top-0 z-10 px-4 py-3 text-start  bg-white text-body-emphasize text-black [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    >
      <div className="flex gap-2 [th:last-child_&]:gap-0">
        <span className="flex-1 min-w-0 [th:last-child_&]:text-end [th:not(:last-child)_&]:whitespace-nowrap!">
          {props.children}
        </span>
        {endIcon && (
          <span className="flex shrink-0 items-center">{endIcon}</span>
        )}
      </div>
    </th>
  )
}

function TableCell({
  className,
  children,
  ...props
}: Readonly<React.ComponentProps<'td'>>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'px-5 py-4 sm:px-6 h-full text-start align-middle truncate [&:has([role=checkbox])]:pr-0 last:text-end',
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
}

function TableCaption({
  className,
  ...props
}: Readonly<React.ComponentProps<'caption'>>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...props}
    />
  )
}

const TableSortCol = ({
  sort,
  isShow,
}: Readonly<{
  isShow: boolean
  sort?: (typeof ENUM_DIR_SORT)[number]
}>) => {
  const className = 'size-4 dark:fill-white'
  if (!isShow) return null
  if (sort === 'asc') return <ArrowUp className={className} />
  if (sort === 'desc') return <ArrowDown className={className} />
  return <ArrowUpDown className={className} />
}

const tableActionMeta =
  'sticky right-0 z-10 whitespace-nowrap [&[data-slot=table-head]]:z-[25] [&[data-slot=table-head]]:bg-white'

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSortCol,
  tableActionMeta,
}
