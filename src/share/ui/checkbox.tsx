'use client'

import * as React from 'react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'

import { cn } from '@/share/lib/utils'
import { CheckIcon } from 'lucide-react'

function Checkbox({
  className,
  ...props
}: Readonly<React.ComponentProps<typeof CheckboxPrimitive.Root>>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'dark:bg-input/30 data-checked:bg-blue-2 data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-none aria-invalid:aria-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 peer relative flex size-5 shrink-0 items-center justify-center rounded-[6px] border border-grey-1/29 cursor-pointer transition-shadow outline-none group-has-disabled/field:bg-grey-2 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 disabled:cursor-not-allowed disabled:bg-grey-2 disabled:border-none aria-invalid:ring-3',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-4"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
