import { AlertErrorIcon, AlertInfo } from '@/share/icons'
import { cn } from '@/share/lib/utils'

function getAlertProps(type: 'error' | 'success' | 'info' | 'warning') {
  switch (type) {
    case 'error':
      return {
        backgroundColor: 'bg-red-6',
        icon: <AlertErrorIcon className="size-6 text-red-1" />,
      }
    case 'info':
      return {
        backgroundColor: 'bg-blue-6',
        icon: <AlertInfo className="size-6 text-blue-1" />,
      }
    default:
      return {
        backgroundColor: 'bg-grey-7',
        icon: <AlertInfo className="size-6 text-grey-1" />,
      }
  }
}

export default function Alert({
  title,
  description,
  className,
  type,
  ...props
}: Readonly<
  React.ComponentProps<'div'> & {
    title?: string
    description?: React.ReactNode
    type: 'error' | 'success' | 'info' | 'warning'
  }
>) {
  const { backgroundColor, icon } = getAlertProps(type)

  return (
    <div
      className={cn(
        'flex gap-2 justify-start items-center p-3 rounded-md',
        backgroundColor,
        className
      )}
      {...props}
    >
      <div className="self-start min-w-6">{icon}</div>
      <div className="flex flex-col gap-1 text-black-1">
        {title && <span className="text-body-emphasize">{title}</span>}
        {description && (
          <span className="text-body-helptext">{description}</span>
        )}
      </div>
    </div>
  )
}
