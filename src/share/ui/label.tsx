"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/share/lib/utils"

function Label({
  className,
  ...props
}: Readonly<React.ComponentProps<typeof LabelPrimitive.Root>>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "gap-2 text-body-emphasize truncate group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export { Label }
