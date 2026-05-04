import { useModal } from '@/share/hooks/use-modal'
import { Button } from '@/share/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/share/ui/dialog'
import { useCallback } from 'react'
import ConfirmModal from './confirm'
import { useTranslations } from 'next-intl'
import ContainerFormBody from '../form'

export default function Modal({
  open,
  title,
  description,
  onOpenChange,
  onConfirm,
  children,
  confirmTitle,
  showCloseButton = true,
  showFooter = true,
  isConfirmClose = true,
  cancelTitle,
  confirmDisabled,
  contentClassName,
}: Readonly<
  React.ComponentProps<typeof Dialog> & {
    title: string
    description?: string
    onConfirm: () => void
    showCloseButton?: boolean
    showFooter?: boolean
    isConfirmClose?: boolean
    confirmTitle?: string
    cancelTitle?: string
    confirmDisabled?: boolean
    contentClassName?: string
  }
>) {
  const t = useTranslations('form')
  const {
    isOpen: isOpenConfirm,
    openModal: openConfirmModal,
    closeModal: closeConfirmModal,
  } = useModal()

  const handleCloseWithConfirm = useCallback(() => {
    openConfirmModal()
  }, [openConfirmModal])

  const handleCloseDirect = useCallback(() => {
    onOpenChange?.(false)
  }, [onOpenChange])

  const closeModal = isConfirmClose ? handleCloseWithConfirm : handleCloseDirect

  return (
    <>
      <Dialog open={open} onOpenChange={closeModal}>
        <DialogContent
          showCloseButton={showCloseButton}
          className={contentClassName}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <ContainerFormBody
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            {children}
          </ContainerFormBody>
          {showFooter && (
            <DialogFooter
              showCloseButton={showCloseButton}
              cancelTitle={cancelTitle ?? t('btn.cancel')}
            >
              <Button
                type="button"
                variant="default"
                size="lg"
                rounded
                onClick={onConfirm}
                disabled={confirmDisabled}
                className="w-full sm:w-auto"
              >
                {confirmTitle ?? t('btn.save')}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmModal
        title={t('confirm.title')}
        description={t('confirm.description')}
        onConfirm={() => {
          closeConfirmModal()
        }}
        open={isOpenConfirm}
        onOpenChange={(open) => {
          closeConfirmModal()
          if (open) onOpenChange?.(false)
        }}
      />
    </>
  )
}
