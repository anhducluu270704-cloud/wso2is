import * as React from 'react'
import { Slot } from 'radix-ui'

import { cn } from '@/share/lib/utils'
import { ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'

function Breadcrumb({
  className,
  ...props
}: Readonly<React.ComponentProps<'nav'>>) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  )
}

function BreadcrumbList({
  className,
  ...props
}: Readonly<React.ComponentProps<'ol'>>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'text-muted-foreground gap-1.5 text-sm sm:gap-2.5 flex flex-wrap items-center wrap-break-word',
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({
  className,
  ...props
}: Readonly<React.ComponentProps<'li'>>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn(
        'gap-1.5 inline-flex items-center !text-black-3 text-body-helptext',
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: Readonly<
  React.ComponentProps<'a'> & {
    asChild?: boolean
  }
>) {
  const Comp = asChild ? Slot.Root : 'a'

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn('hover:text-foreground transition-colors', className)}
      {...props}
    />
  )
}

function BreadcrumbPage({
  className,
  ...props
}: Readonly<React.ComponentProps<'span'>>) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn('!text-black-2 text-body-helptext', className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: Readonly<React.ComponentProps<'li'>>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      aria-hidden="true"
      className={cn('[&>svg]:size-4 text-black', className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: Readonly<React.ComponentProps<'span'>>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      aria-hidden="true"
      className={cn(
        'size-5 [&>svg]:size-4 flex items-center justify-center',
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
