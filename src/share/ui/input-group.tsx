'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { InputFieldProps } from '@/models/ui/input'
import { cn } from '@/share/lib/utils'
import { Button } from '@/share/ui/button'
import { Input } from '@/share/ui/input'
import { Textarea } from '@/share/ui/textarea'
import { FieldValues } from 'react-hook-form'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

function InputGroup({
  className,
  ...props
}: Readonly<React.ComponentProps<'fieldset'>>) {
  return (
    <fieldset
      data-slot="input-group"
      className={cn(
        'border border-grey-1/29 px-4 has-[[data-slot=input-group-control]:focus-visible]:border-blue-2 has-[[data-slot][aria-invalid=true]]:border-red-1 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 rounded-md transition-[color,box-shadow] has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5 in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 group/input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto',
        'm-0 min-w-0',
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "text-black-1 h-auto gap-2 py-2 text-body-body group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 flex cursor-text items-center justify-center select-none",
  {
    variants: {
      align: {
        'inline-start':
          'pr-2 has-[>button]:ml-[-0.25rem] has-[>kbd]:ml-[-0.15rem] order-first',
        'inline-end':
          'ml-auto pl-4 pr-0 justify-end has-[>button]:mr-[-0.25rem] has-[>kbd]:mr-[-0.15rem] order-last',
        'block-start':
          'px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2 order-first w-full justify-start',
        'block-end':
          'px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2 order-last w-full justify-start',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  }
)

function InputGroupAddon({
  className,
  align = 'inline-start',
  htmlFor,
  ref,
  ...props
}: Readonly<
  React.ComponentProps<'div'> &
    VariantProps<typeof inputGroupAddonVariants> & {
      htmlFor?: string
    }
>) {
  const baseAddonProps = {
    'data-slot': 'input-group-addon',
    'data-align': align,
    className: cn(inputGroupAddonVariants({ align }), className),
    ref,
    ...props,
  }

  if (htmlFor) {
    const { ref, ...rest } = baseAddonProps
    return (
      <label
        ref={ref as React.Ref<HTMLLabelElement>}
        htmlFor={htmlFor}
        {...(rest as React.ComponentPropsWithoutRef<'label'>)}
      />
    )
  }

  return <div {...baseAddonProps} />
}

export const inputGroupButtonVariants = cva(
  'gap-2 text-sm shadow-none flex items-center',
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: '',
        'icon-xs':
          'size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0',
        'icon-sm':
          '[&_svg]:size-5! [&_svg]:stroke-2! [&_svg]:text-grey-6 p-0 has-[>svg]:p-0 h-fit',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  }
)

function InputGroupButton({
  className,
  type = 'button',
  variant = 'outline',
  size = 'xs',
  tooltip,
  tooltipPlacement = 'right',
  ...props
}: Readonly<
  Omit<React.ComponentProps<typeof Button>, 'size'> &
    VariantProps<typeof inputGroupButtonVariants> & {
      tooltip?: React.ReactNode
      tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left'
    }
>) {
  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type={type}
            data-size={size}
            variant={variant}
            className={cn(inputGroupButtonVariants({ size }), className)}
            {...props}
          />
        </TooltipTrigger>
        <TooltipContent side={tooltipPlacement}>{tooltip}</TooltipContent>
      </Tooltip>
    )
  }
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({
  className,
  ...props
}: Readonly<React.ComponentProps<'span'>>) {
  return (
    <span
      className={cn(
        "text-muted-foreground gap-2 text-sm [&_svg:not([class*='size-'])]:size-6 flex items-center [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  InputFieldProps<FieldValues>
>(function InputGroupInput({ className, ...props }, ref) {
  return (
    <Input
      ref={ref}
      data-slot="input-group-control"
      className={cn(
        'rounded-none border-0 bg-transparent dark:bg-transparent p-0',
        className
      )}
      {...props}
    />
  )
}) as <T extends FieldValues>(
  props: InputFieldProps<T> & { ref?: React.Ref<HTMLInputElement> }
) => React.ReactElement

function InputGroupTextarea({
  className,
  ...props
}: Readonly<React.ComponentProps<'textarea'>>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        'rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent flex-1 resize-none',
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
}
