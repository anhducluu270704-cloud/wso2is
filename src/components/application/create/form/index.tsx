'use client'

import { useRouter } from '@/i18n/navigation'
import ContainerFormBody from '@/share/components/form'
import InputField from '@/share/components/input'
import TextareaField from '@/share/components/input/textarea'
import { Button } from '@/share/ui/button'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useApplicationForm } from './hook'

export default function ApplicationForm({
  callback,
}: Readonly<{ callback: string }>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('application')

  const { form, handleSubmit, createMutation } = useApplicationForm({
    onSuccess: () => {
      const query = searchParams.toString()
      router.push(
        `${callback}?${query}${query ? '&' : ''}inlinetoasttype=success&inlinetoastmsgkey=mess.create.success`
      )
    },
  })

  const onCancel = () => {
    form.reset()
    router.back()
  }

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ContainerFormBody
        errorMessage={createMutation.error?.response?.data?.error}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-16">
          <InputField
            name="name"
            required
            register={form.register}
            label={t('fields.name.label')}
            errors={form.formState.errors.name?.message}
            description={t('fields.name.description')}
          />

          <InputField
            name="throttlingPolicy"
            register={form.register}
            label={t('fields.quota.label')}
            description={t('fields.quota.description')}
            disabled
          />
        </div>

        <TextareaField
          name="description"
          label={t('fields.description.label')}
          rows={4}
          maxLength={512}
          register={form.register}
          value={form.watch('description') ?? ''}
          errors={form.formState.errors.description?.message}
        />
      </ContainerFormBody>
      <div className="flex w-full flex-col-reverse gap-4 self-end md:grid md:w-[375px] md:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          rounded
          onClick={onCancel}
          fullWidth
        >
          {t('btn.cancel')}
        </Button>

        <Button
          type="submit"
          variant="default"
          size="sm"
          rounded
          disabled={createMutation.isPending}
          fullWidth
        >
          {t('btn.next')}
        </Button>
      </div>
    </form>
  )
}
