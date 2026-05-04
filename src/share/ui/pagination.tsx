'use client'

import * as React from 'react'

import { cn } from '@/share/lib/utils'
import { Button } from '@/share/ui/button'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react'

function Pagination({
  className,
  ...props
}: Readonly<React.ComponentProps<'nav'>>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-end', className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: Readonly<React.ComponentProps<'ul'>>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex items-center', className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: Readonly<React.ComponentProps<'li'>>) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>

function PaginationLink({
  className,
  isActive,
  size = 'sm',
  disabled,
  onClick,
  href,
  children,
  ...props
}: Readonly<PaginationLinkProps>) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    if (e.key === ' ' && href !== undefined) {
      e.preventDefault()
      e.currentTarget.click()
    }
  }

  const sharedProps = {
    'aria-current': isActive ? ('page' as const) : undefined,
    'aria-disabled': disabled,
    'data-slot': 'pagination-link',
    'data-active': isActive,
    onClick: disabled ? undefined : onClick,
    onKeyDown: handleKeyDown,
  }

  return (
    <Button
      asChild
      variant={'ghost'}
      size={size}
      className={cn(
        className,
        disabled,
        isActive && 'bg-blue-6 text-blue-2 hover:text-black-1',
        'h-10 w-10 p-0'
      )}
      disabled={disabled ?? false}
      rounded
    >
      {href !== undefined && !disabled ? (
        <a href={href} {...sharedProps} {...props}>
          {children}
        </a>
      ) : (
        <button
          type="button"
          aria-current={sharedProps['aria-current']}
          aria-disabled={sharedProps['aria-disabled']}
          data-slot={sharedProps['data-slot']}
          data-active={sharedProps['data-active']}
          onClick={
            sharedProps.onClick as unknown as React.MouseEventHandler<HTMLButtonElement>
          }
          onKeyDown={sharedProps.onKeyDown}
          {...(props as Omit<
            React.ComponentProps<'button'>,
            'type' | 'aria-current' | 'aria-disabled' | 'onClick' | 'onKeyDown'
          >)}
        >
          {children}
        </button>
      )}
    </Button>
  )
}

function PaginationPrevious({
  className,
  text = '',
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  text?: string
  disabled?: boolean
}) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="sm"
      className={className}
      disabled={disabled ?? false}
      {...props}
    >
      <ChevronLeftIcon />
      {text && <span className="hidden sm:block">{text}</span>}
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = '',
  disabled,
  ...props
}: Readonly<
  React.ComponentProps<typeof PaginationLink> & {
    text?: string
    disabled?: boolean
  }
>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="icon"
      disabled={disabled ?? false}
      className={className}
      {...props}
    >
      {text && <span className="hidden sm:block">{text}</span>}
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: Readonly<React.ComponentProps<'span'>>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "size-9 [&_svg:not([class*='size-'])]:size-4 flex items-center justify-center",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
