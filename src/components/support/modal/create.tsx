'use client'

import { REQUEST_TYPE_OPTIONS } from '@/constants/support'
import InputField from '@/share/components/input'
import InputSelectField from '@/share/components/input/select'
import TextareaField from '@/share/components/input/textarea'
import Modal from '@/share/components/modal'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useSupportRequestForm, defaultValues } from './hook'

type SupportRequestModalProps = Readonly<{
  open: boolean
  onClose: () => void
}>

export function SupportRequestModal({
  open,
  onClose,
}: Readonly<SupportRequestModalProps>) {
  const t = useTranslations('support')
  const { form, onSubmit, mutation } = useSupportRequestForm({
    onSuccess: onClose,
  })

  useEffect(() => {
    if (!open) form.reset(defaultValues)
  }, [open, form])

  const requestTypeOptions = REQUEST_TYPE_OPTIONS.map((opt) => ({
    value: opt.value,
    label: t(`request_type_options.${opt.labelKey}`),
  }))

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={t('title')}
      description=""
      onConfirm={() => form.handleSubmit(onSubmit)()}
      confirmTitle={t('fields.actions_submit')}
      confirmDisabled={mutation.isPending}
      contentClassName="sm:max-w-[800px]"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <InputField
          name="full_name"
          register={form.register}
          label={t('fields.full_name_label')}
          required
          size="sm"
          errors={form.formState.errors.full_name?.message}
        />
        <InputField
          name="email"
          type="email"
          register={form.register}
          label={t('fields.email_label')}
          required
          size="sm"
          errors={form.formState.errors.email?.message}
        />
        <InputField
          name="company_name"
          register={form.register}
          label={t('fields.company_label')}
          required
          size="sm"
          errors={form.formState.errors.company_name?.message}
        />
        <InputField
          name="phone_number"
          register={form.register}
          label={t('fields.phone_number_label')}
          required
          size="sm"
          errors={form.formState.errors.phone_number?.message}
        />
        <InputSelectField
          name="request_type"
          control={form.control}
          label={t('fields.request_type_label')}
          required
          placeholder={t('request_type_options.technical')}
          options={requestTypeOptions}
          size="sm"
        />
      </div>
      <TextareaField
        name="description"
        register={form.register}
        label={t('fields.description_label')}
        placeholder={t('fields.description_placeholder')}
        rows={8}
        maxLength={512}
        errors={form.formState.errors.description?.message}
      />
    </Modal>
  )
}
