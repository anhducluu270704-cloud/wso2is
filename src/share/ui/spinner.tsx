import { cn } from '@/share/lib/utils'
import { Loading } from '../icons'

function Spinner({
  className,
  ...props
}: Readonly<React.ComponentProps<'svg'>>) {
  return (
    <output aria-label="Loading" className="inline-flex">
      <Loading className={cn('size-6 animate-spin', className)} {...props} />
    </output>
  )
}

export function SpinnerCustom({ className }: Readonly<{ className?: string }>) {
  return (
    <div
      className={cn('flex items-center justify-center h-full py-24', className)}
    >
      <Spinner />
    </div>
  )
}
