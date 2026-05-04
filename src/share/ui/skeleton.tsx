import { cn } from "@/share/lib/utils"

function Skeleton({
  className,
  ...props
}: Readonly<React.ComponentProps<"div">>) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-white rounded-xl animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
