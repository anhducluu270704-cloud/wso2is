import { Skeleton } from '@/share/ui/skeleton'

export function TabsSkeleton() {
  return (
    <div className="flex flex-1 gap-6">
      <Skeleton className="h-80 w-full max-w-[338px]" />
      <Skeleton className="h-96 w-full flex-1" />
    </div>
  )
}
