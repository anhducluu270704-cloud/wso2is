import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/share/lib/utils'

const buttonVariants = cva(
  "w-fit rounded-lg bg-clip-padding text-body-emphasize [&_svg:not([class*='size-'])]:size-6 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:cursor-not-allowed disabled:bg-grey-3 disabled:pointer-events-none disabled:text-grey-2 disabled:[&_svg]:text-grey-2 disabled:border-transparent [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none hover:cursor-pointer aria-invalid:border-destructive dark:aria-invalid:border-destructive/50",
  {
    variants: {
      variant: {
        default:
          'bg-black !text-white hover:bg-grey-1 disabled:!text-grey-2 [&_svg]:text-red-2 dark:bg-white dark:text-black-2 dark:hover:bg-white-2 dark:[&_svg]:text-red-1',
        outline:
          'border border-black bg-transparent [&_svg]:text-red-2 hover:bg-black hover:text-white hover:[&_svg]:!text-white dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground',
        secondary:
          'bg-white text-black-1 hover:bg-grey-12 [&_svg]:text-red-2 aria-expanded:bg-grey-12 aria-expanded:text-black-1',
        ghost:
          'bg-transparent text-black-1 hover:bg-grey-1/10 [&_svg]:text-black-1 disabled:bg-transparent',
        select:
          'border border-grey-1/29 bg-white text-black-1 hover:border-grey-0 hover:bg-white [&_svg]:text-black-2 aria-expanded:border-grey-0 disabled:bg-grey-3 disabled:text-grey-2 disabled:[&_svg]:text-grey-2 disabled:border-grey-0',
      },
      size: {
        default:
          "text-body-emphasize rounded-lg py-4 px-6 gap-2 h-14 [&_svg:not([class*='size-'])]:size-6 [&_svg:not([class*='size-'])]:stroke-4 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        select:
          'h-11 gap-2 rounded-[min(var(--radius-md),8px)] px-2 text-body-body [&_svg:not([class*="size-"])]:size-4 in-data-[slot=button-group]:rounded-full has-data-[icon=inline-end]:pl-2 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 has-data-[icon=inline-start]:pr-2',
        xs: "h-8 gap-2 rounded-[min(var(--radius-md),8px)] px-3 text-body-label in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-10 gap-2 px-6 text-body-emphasize font-semibold rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5',
        lg: 'h-11 gap-2 px-4',
        icon: '[&_svg:not([class*="size-"])]:!size-6',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-5",
        'icon-sm':
          'size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md',
        'icon-lg': 'size-11',
      },
      fullWidth: {
        true: 'w-full',
      },
      rounded: {
        true: 'rounded-full',
      },
      linked: {
        true: 'min-w-auto h-auto p-0 !bg-transparent hover:underline decoration-auto underline-offset-auto',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        linked: true,
        class: '[&_svg]:!text-white dark:[&_svg]:!text-red-1',
      },
      {
        variant: 'secondary',
        linked: true,
        class: '[&_svg]:text-red-2',
      },
      {
        variant: 'outline',
        linked: true,
        class:
          '!text-body-emphasize border-none text-blue-2 hover:text-blue-2 p-0 h-fit',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  fullWidth = false,
  rounded = false,
  linked = false,
  asChild = false,
  ...props
}: Readonly<
  React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
>) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({ variant, size, fullWidth, rounded, linked, className })
      )}
      {...props}
    />
  )
}

export { Button, buttonVariants }
