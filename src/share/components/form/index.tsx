import { cn } from '@/share/lib/utils'
import Alert from '../alert'

export default function ContainerFormBody({
  children,
  className,
  errorMessage,
  ...props
}: Readonly<React.ComponentProps<'form'> & { errorMessage?: string }>) {
  return (
    <form
      className={cn('flex flex-col gap-6 overflow-hidden', className)}
      {...props}
    >
      {children}
      {errorMessage && <Alert type="error" description={errorMessage} />}
    </form>
  )
}
