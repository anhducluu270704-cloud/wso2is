'use client'

import * as React from 'react'
import { Accordion as AccordionPrimitive } from 'radix-ui'

import { cn } from '@/share/lib/utils'
import { ChevronDown, ChevronUp } from '../icons'

function Accordion({
  className,
  ...props
}: Readonly<React.ComponentProps<typeof AccordionPrimitive.Root>>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('flex w-full flex-col', className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: Readonly<React.ComponentProps<typeof AccordionPrimitive.Item>>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('not-last:border-b border-grey-9', className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: Readonly<React.ComponentProps<typeof AccordionPrimitive.Trigger>>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:after:border-ring rounded-md py-4 text-left text-body-emphasize! text-black hover:no-underline focus-visible:ring-3 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-red-1 group/accordion-trigger relative flex flex-1 cursor-pointer items-start justify-between border-b border-transparent transition-all outline-none disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <ChevronUp
          data-slot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: Readonly<React.ComponentProps<typeof AccordionPrimitive.Content>>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-open:animate-accordion-down data-closed:animate-accordion-up text-sm overflow-hidden"
      {...props}
    >
      <div
        className={cn(
          'pt-0 pb-4 [&_a]:hover:text-foreground h-(--radix-accordion-content-height) [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4 [&_p]:text-body-body! [&_p]:text-grey-5',
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
