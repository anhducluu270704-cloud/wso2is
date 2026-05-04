import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/share/lib/utils'

const badgeVariants = cva(
  'gap-1 rounded-full px-2 h-6 text-[13px] leading-[16px] text-black-1 [&>svg]:text-black-1 transition-all [&>svg]:size-5 inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none overflow-hidden group/badge',
  {
    variants: {
      variant: {
        inactive: 'bg-grey-10 text-black-1',
        active: 'bg-green-2 text-green-1',
        rejected: 'bg-red-4 text-red-5',
        pending: 'bg-yellow-1 text-yellow-2',
      },
    },
    defaultVariants: {
      variant: 'inactive',
    },
  }
)

function Badge({
  className,
  variant = 'active',
  asChild = false,
  ...props
}: Readonly<
  React.ComponentProps<'span'> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }
>) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
