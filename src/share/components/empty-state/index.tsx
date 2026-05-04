import { Empty, EmptyInfo } from '@/share/icons'
import { Button } from '@/share/ui/button'
import { cn } from '@/share/lib/utils'

export default function EmptyState({
  className,
  header,
  title,
  description,
  buttonTitle,
  type = 'default',
  onClick,
}: Readonly<{
  className?: string
  header?: React.ReactNode
  title: string
  description?: string
  buttonTitle?: string
  type?: 'default' | 'info'
  onClick?: () => void
}>) {
  return (
    <div
      className={cn(
        'bg-grey-7 rounded-xl py-8 px-12 flex flex-col items-center justify-center gap-4 w-full',
        className
      )}
    >
      {header && (
        <div className="flex flex-1 w-full items-start justify-between">
          <span className="text-headline-md-mobile md:text-headline-md-desktop text-center">
            {header}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-4 items-center justify-center py-8 max-w-[343px]">
        {type === 'default' ? (
          <Empty className="size-36" />
        ) : (
          <EmptyInfo className="size-36" />
        )}
        <div className="flex flex-col gap-2 items-center justify-center">
          <span className="text-title-md-emphasize text-black-1 text-center">
            {title}
          </span>
          {description && (
            <span className="text-body-helptext text-grey-6 text-center">
              {description}
            </span>
          )}
        </div>
        {onClick && (
          <Button onClick={onClick} variant="outline" size="xs" rounded>
            {buttonTitle}
          </Button>
        )}
      </div>
    </div>
  )
}
