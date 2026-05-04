'use client'

import NotFound404 from '@/app/not-found'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useDeleteApplicationMutation } from '@/services/application/application.mutations'
import { useGetApplication } from '@/services/application/application.query-options'
import FullPageLayout from '@/share/components/full-page/full-layout'
import LoadingPage from '@/share/components/full-page/loading'
import ListTab from '@/share/components/list-tab'
import ConfirmModal from '@/share/components/modal/confirm'
import {
  ChartDonut,
  DeleteDocument,
  DeleteIcon,
  KeyIcon,
  LeadingIcon,
  WebhooksIcon,
} from '@/share/icons'
import { Badge } from '@/share/ui/badge'
import { Button } from '@/share/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useApplicationUpdateForm } from './hook'
import OAuth2TokensSection from './keys/access-key'
import OverviewSection from './overview'
import ApplicationSubscriptions from './subscriptions'

function confirmDeleteTitleNameRich(chunks: ReactNode) {
  return (
    <span className="inline-block min-w-0 max-w-[240px] truncate align-bottom ml-1">
      {chunks}
    </span>
  )
}

export default function ApplicationDetailWrapper({
  app_id,
  api_product_name,
}: Readonly<{
  app_id: string
  api_product_name: string
}>) {
  const t = useTranslations('application')
  const tForm = useTranslations('form')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const isSavingNameRef = useRef(false)

  const deleteMutation = useDeleteApplicationMutation()
  const { form, handleSubmit: submitApplication } = useApplicationUpdateForm(
    app_id,
    () => {
      isSavingNameRef.current = false
    }
  )
  const { data, isError, isLoading, isSuccess } = useGetApplication(app_id)

  const [openConfirm, setOpenConfirm] = useState(false)

  const [isEditName, setIsEditName] = useState(false)

  const closeEditor = () => setIsEditName(false)

  const EditName = () => {
    if (isSavingNameRef.current) return
    if (!data?.data) return
    form.reset({
      name: data.data.name,
      throttlingPolicy: data.data.throttlingPolicy,
      description: data.data.description ?? '',
    })
    setIsEditName(true)
  }

  // Ref guard runs only when the form is submitted, not during render.
  // eslint-disable-next-line react-hooks/refs -- RHF handleSubmit wraps callback; ref is read on submit
  const commitName = form.handleSubmit((formData) => {
    if (isSavingNameRef.current) return
    if (!formData) return
    const next = formData.name.trim()
    if (!next) {
      form.setValue('name', formData.name)
      closeEditor()
      return
    }

    const originalName = (data?.data.name ?? '').trim()
    if (next === originalName) {
      closeEditor()
      return
    }

    isSavingNameRef.current = true
    closeEditor()

    submitApplication({
      name: next,
      throttlingPolicy: formData.throttlingPolicy,
      description: formData.description,
    })
  })

  const cancelName = () => {
    if (isSavingNameRef.current) return
    form.setValue('name', data?.data.name ?? '')
    closeEditor()
  }

  const nameWatch = form.watch('name')
  const { ref: registerNameRef, ...nameField } = form.register('name')

  useEffect(() => {
    if (!isEditName) return
    const input = nameInputRef.current
    if (!input) return
    input.focus()
    input.select()
  }, [isEditName])

  if (isLoading) {
    return <LoadingPage />
  }

  if (isError) {
    return <NotFound404 />
  }

  if (isSuccess) {
    const applicationDetailSidebarItems = [
      {
        id: 'overview',
        label: 'list_tabs.overview',
        value: 'overview',
        icon: <ChartDonut />,
        content: <OverviewSection applicationData={data.data} />,
      },
      {
        id: 'access-key',
        label: 'list_tabs.access_key',
        value: 'access-key',
        icon: <KeyIcon />,
        content: <OAuth2TokensSection applicationData={data.data} />,
      },
      {
        id: 'api-registration',
        label: 'list_tabs.api-registration',
        value: 'api-registration',
        icon: <WebhooksIcon />,
        content: <ApplicationSubscriptions applicationData={data.data} />,
      },
    ]

    return (
      <FullPageLayout>
        <div className="container mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Button
              variant="secondary"
              size="sm"
              className="font-normal!"
              rounded
              linked
              onClick={() => {
                const fallbackPath = `/api-products`
                const backPath = pathname.replace(
                  new RegExp(`/application/${app_id}$`),
                  ''
                )
                router.push(backPath || fallbackPath)
              }}
            >
              <ChevronLeft className="size-5 text-black!" />
              {t('btn.back', {
                name: api_product_name,
              })}
            </Button>
            <div className="flex items-start justify-between gap-4 max-w-full! overflow-hidden">
              <div className="flex items-center gap-3 truncate overflow-hidden">
                <form
                  onSubmit={commitName}
                  className="flex truncate flex-col gap-2"
                >
                  {!isEditName ? (
                    <div className="flex max-w-full min-w-0 items-center gap-2">
                      <span className="text-headline-md-mobile md:text-headline-md-desktop truncate px-1.5 py-1 text-black-1">
                        {data.data.name}
                      </span>
                      <button
                        type="button"
                        className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-black-1 outline-none transition-colors hover:bg-grey-3 focus-visible:ring-2 focus-visible:ring-blue-2 focus-visible:ring-offset-2"
                        onClick={() => EditName()}
                      >
                        <LeadingIcon className="size-6 shrink-0" aria-hidden />
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        {...nameField}
                        ref={(el) => {
                          registerNameRef(el)
                          nameInputRef.current = el
                        }}
                        className="min-w-[50px] w-auto text-headline-md-mobile md:text-headline-md-desktop text-black-1 px-1.5 py-0.5 rounded-md focus:outline-none border border-transparent focus:border-blue-2 focus-visible:border-blue-2 focus:bg-grey-3 max-w-full"
                        style={{
                          width: `${Math.max(nameWatch?.length ?? 0, 1)}ch`,
                        }}
                        aria-label="Application name"
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            e.preventDefault()
                            cancelName()
                          }
                        }}
                        onBlur={() => {
                          void commitName()
                        }}
                      />
                      {form.formState.errors.name?.message && (
                        <span className="text-red-1 text-[12px] leading-[18px] font-normal">
                          {tForm(form.formState.errors.name?.message)}
                        </span>
                      )}
                    </>
                  )}
                </form>
              </div>
              {data.data.tier === 'SANDBOX' && (
                <Button
                  variant="outline"
                  size="lg"
                  rounded
                  onClick={() => setOpenConfirm(true)}
                >
                  <DeleteIcon className="size-6 text-black-1!" />
                  {t('btn.delete_application')}
                </Button>
              )}
            </div>
            <Badge variant={'active'} className="text-black-1">
              {data.data.subscriptionCount} Subscription
            </Badge>
          </div>
          <ListTab listItems={applicationDetailSidebarItems} />
          <ConfirmModal
            open={openConfirm}
            onOpenChange={setOpenConfirm}
            title={
              <span className="inline max-w-full">
                {t.rich('confirm_delete.title', {
                  name: confirmDeleteTitleNameRich,
                  value: data.data.name,
                })}
              </span>
            }
            description={t('confirm_delete.description')}
            onConfirm={() => {
              deleteMutation.mutate(data.data.applicationId, {
                onSuccess: () => {
                  setOpenConfirm(false)
                  const fallbackPath = `/api-products`
                  const productDetailPath = pathname.replace(
                    new RegExp(`/application/${app_id}$`),
                    ''
                  )
                  const targetPath = productDetailPath || fallbackPath
                  const query = searchParams.toString()
                  router.push(
                    `${targetPath}?${query}${query ? '&' : ''}inlinetoasttype=success&inlinetoastmsgkey=mess.delete.success`
                  )
                },
              })
            }}
            cancelTitle={t('btn.cancel')}
            confirmTitle={t('btn.delete')}
            icon={<DeleteDocument className="size-36" />}
          />
        </div>
      </FullPageLayout>
    )
  }
}
