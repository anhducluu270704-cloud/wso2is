'use client'

import { useRouter } from '@/i18n/navigation'
import { useAuthSession } from '@/providers/auth-session-provider'
import { Operation } from '@/services/api-product/apiProduct.schema'
import ContainerFormBody from '@/share/components/form'
import { useModal } from '@/share/hooks/use-modal'
import { useGetUrlLoginMutation } from '@/share/layout/end-user/header/hook'
import { Button } from '@/share/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/share/ui/dialog'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import ApiResourceTable from './table'

type AboutSectionProps = Readonly<{
  description?: string | null
  imageSrc?: string | null
  resources?: Operation[]
  documentLink?: string | null
}>

export default function AboutSection({
  description,
  imageSrc,
  resources,
  documentLink,
}: Readonly<AboutSectionProps>) {
  const t = useTranslations('api_product')
  const router = useRouter()
  const { isOpen, openModal, closeModal } = useModal()
  const { authSession } = useAuthSession()
  const mutate = useGetUrlLoginMutation()

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-25">
        <div className="flex flex-col gap-4 w-full lg:max-w-1/3">
          <div className="flex flex-col gap-4 pb-8">
            <div className="text-headline-md-mobile md:text-headline-md-desktop">
              {t('about.title')}
            </div>

            {description && (
              <div className="text-body-body text-grey-5">{description}</div>
            )}
          </div>
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={t('about.image_alt')}
              width={417}
              height={117}
              className="object-contain"
            />
          )}
          <Button
            variant="outline"
            linked
            onClick={() => {
              if (!authSession) {
                openModal()
              } else if (documentLink) {
                window.open(documentLink, '_blank', 'noopener,noreferrer')
              }
            }}
          >
            {t('about.spec_button')}
          </Button>
        </div>
        <div className="flex-1 lg:max-w-2/3">
          <ApiResourceTable resources={resources} />
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="md:min-w-[529px]">
          <DialogHeader>
            <DialogTitle>{t('confirm.login.title')}</DialogTitle>
          </DialogHeader>
          <ContainerFormBody>
            <div className="flex items-center justify-center gap-2.5 p-8 rounded-xl bg-light-blue-hor text-body-emphasize text-blue-2">
              {t('about.spec_button')}
            </div>
          </ContainerFormBody>
          <DialogFooter showCloseButton={false}>
            <Button
              variant="outline"
              size="lg"
              rounded
              onClick={() => {
                router.push('/signup')
              }}
              className="w-full sm:max-w-[182px]"
            >
              {t('btn.signup')}
            </Button>
            <Button
              variant="default"
              size="lg"
              rounded
              onClick={() => {
                mutate.mutate()
              }}
              className="w-full sm:max-w-[182px]"
            >
              {t('btn.login')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
