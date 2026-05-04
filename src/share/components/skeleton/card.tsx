import { Card, CardContent } from '@/share/ui/card'
import { Skeleton } from '@/share/ui/skeleton'

export function CardSkeleton() {
  return (
    <Card className="h-full border-transparent bg-white p-0 shadow-none ring-0">
      <Skeleton className="aspect-4/3 w-full rounded-t-xl" />
      <CardContent className="flex flex-1 flex-col gap-4 pt-4">
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </CardContent>
    </Card>
  )
}
