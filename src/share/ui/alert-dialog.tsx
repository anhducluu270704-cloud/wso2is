'use client'

import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/share/lib/utils'
import { Button } from '@/share/ui/button'

function AlertDialog({
  ...props
}: Readonly<React.ComponentProps<typeof AlertDialogPrimitive.Root>>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: Readonly<React.ComponentProps<typeof AlertDialogPrimitive.Trigger>>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  ...props
}: Readonly<React.ComponentProps<typeof AlertDialogPrimitive.Portal>>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: Readonly<React.ComponentProps<typeof AlertDialogPrimitive.Overlay>>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-200',
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = 'default',
  children,
  ...props
}: Readonly<
  React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
    size?: 'default' | 'sm'
  }
>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          'data-open:animate-in overflow-hidden data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 bg-background ring-foreground/10 gap-6 rounded-2xl p-6 ring-1 duration-100 data-[size=default]:max-w-sm data-[size=sm]:max-w-xs data-[size=default]:md:max-w-[512px] group/alert-dialog-content fixed top-1/2 left-1/2 z-200 grid w-full -translate-x-1/2 -translate-y-1/2 outline-none',
          className
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: Readonly<React.ComponentProps<'div'>>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        'flex flex-col gap-6 items-center justify-center max-w-full! mb-4',
        className
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: Readonly<React.ComponentProps<'div'>>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn('flex justify-center items-center gap-2', className)}
      {...props}
    />
  )
}

function AlertDialogMedia({
  className,
  ...props
}: Readonly<React.ComponentProps<'div'>>) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        'size-36 flex flex-1items-center justify-center',
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: Readonly<React.ComponentProps<typeof AlertDialogPrimitive.Title>>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        'max-w-full! text-title-lg line-clamp-2 whitespace-normal wrap-break-word text-center sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
        className
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: Readonly<React.ComponentProps<typeof AlertDialogPrimitive.Description>>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        'text-body-helptext text-grey-6 text-center whitespace-normal wrap-anywhere *:[a]:underline *:[a]:underline-offset-3',
        className
      )}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant = 'default',
  size = 'sm',
  rounded = false,
  ...props
}: Readonly<
  React.ComponentProps<typeof AlertDialogPrimitive.Action> &
    Pick<React.ComponentProps<typeof Button>, 'variant' | 'size' | 'rounded'>
>) {
  return (
    <Button variant={variant} size={size} asChild rounded={rounded}>
      <AlertDialogPrimitive.Action
        data-slot="alert-dialog-action"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

function AlertDialogCancel({
  className,
  variant = 'outline',
  size = 'sm',
  rounded = false,
  ...props
}: Readonly<
  React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
    Pick<React.ComponentProps<typeof Button>, 'variant' | 'size' | 'rounded'>
>) {
  return (
    <Button variant={variant} size={size} asChild rounded={rounded}>
      <AlertDialogPrimitive.Cancel
        data-slot="alert-dialog-cancel"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
