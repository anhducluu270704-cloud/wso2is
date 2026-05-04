import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/share/ui/alert-dialog'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  cancelTitle,
  confirmTitle,
  icon,
  className,
}: Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description: string
  onConfirm: () => void
  cancelTitle?: string
  confirmTitle?: string
  icon?: React.ReactNode
  className?: string
}>) {
  const t = useTranslations('form')

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <div className="flex w-full justify-end">
            <AlertDialogCancel variant="secondary" size="icon" rounded>
              <X className="text-black-1!" />
            </AlertDialogCancel>
          </div>
          {icon && <AlertDialogMedia>{icon}</AlertDialogMedia>}
          <div className="flex flex-1 flex-col max-w-full gap-3 items-center justify-center">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel rounded>
            {cancelTitle ?? t('btn.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            rounded
            onClick={() => {
              onOpenChange(true)
              onConfirm()
            }}
          >
            {confirmTitle ?? t('btn.exit')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
