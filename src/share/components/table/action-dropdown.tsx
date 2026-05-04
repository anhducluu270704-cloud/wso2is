import { cn } from '@/share/lib/utils'
import { Button } from '@/share/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/share/ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'

export default function ActionTableDropdown({
  children,
  className,
}: Readonly<{
  children: React.ReactNode
  className?: string
}>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="h-6 rounded-sm p-0 hover:bg-grey-3"
        >
          <Ellipsis className="size-6 !text-black-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          'min-w-[200px] gap-0 rounded-2xl border border-grey-1/12 bg-white p-2',
          className,
        )}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
