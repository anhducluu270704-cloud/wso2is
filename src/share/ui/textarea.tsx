import * as React from "react"

import { cn } from "@/share/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

export const textareaVariants = cva(
  "border bg-white text-grey-1 transition-[color,box-shadow] placeholder:font-normal placeholder:text-grey-1/50 w-full min-w-0 outline-none flex field-sizing-content min-h-16 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
  {
    variants: {
      size: {
        xs: "px-2 py-1.5 rounded-md text-body-helptext min-h-18",
        sm: "px-2 py-2 rounded-md text-body-helptext min-h-20",
        md: "py-2 px-4 rounded-lg text-body-body min-h-24",
        lg: "px-3 py-3 rounded-lg text-body-body min-h-28",
      },
      variant: {
        default:
          "border border-grey-1/29 focus:border-blue-2 focus-visible:border-blue-2 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50",
        error:
          "border border-red-1 focus:border-red-1 focus-visible:border-red-1",
        success:
          "border border-green-1/50 focus-visible:border-green-1",
      },
      disabled: {
        true:
          "pointer-events-none cursor-not-allowed opacity-50 border-grey-0 placeholder:text-grey-1/50 bg-grey-3",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      disabled: false,
    },
  }
)

export type TextareaVariantProps = VariantProps<typeof textareaVariants>

function Textarea({
  className,
  size,
  variant,
  disabled,
  ...props
}: Readonly<
  React.ComponentProps<'textarea'> & TextareaVariantProps
>) {
  return (
    <textarea
      data-slot="textarea"
      disabled={disabled}
      className={cn(textareaVariants({ size, variant, disabled, className }))}
      {...props}
    />
  )
}

export { Textarea }
