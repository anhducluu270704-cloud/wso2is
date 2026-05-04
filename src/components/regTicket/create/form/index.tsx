import { useAuthSession } from '@/providers/auth-session-provider'
import ContainerFormBody from '@/share/components/form'
import { notFound } from 'next/navigation'
import { useRegTicketForm } from './hook'
import InputField from '@/share/components/input'
import { ScenarioCertificateDetail } from '@/services/scenario/scenario.schema'
import TextareaField from '@/share/components/input/textarea'
import { useTranslations } from 'next-intl'
import { Button } from '@/share/ui/button'
import FileIcon from '@/share/icons/file.svg'

export default function RegTicketForm({
  scenarioCertificate,
}: Readonly<{
  scenarioCertificate: ScenarioCertificateDetail
}>) {
  const { authSession } = useAuthSession()

  if (!authSession) return notFound()
  const t = useTranslations('regTicket')
  const { regTicketForm, onSubmit } = useRegTicketForm({
    scenarioCertificate: scenarioCertificate,
    authSession: authSession.user_info,
  })

  return (
    <ContainerFormBody
      onSubmit={regTicketForm.handleSubmit(onSubmit)}
      className="rounded-2xl px-16 py-8 bg-white gap-8 max-h-auto overflow-hidden"
    >
      <div className="flex flex-col gap-4">
        <div className="text-title-md ">{t('user_info.title')}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-x-16 gap-y-6">
          <FieldView
            label={t('fields.fullName')}
            value={authSession.user_info.fullName}
          />
          <FieldView
            label={t('fields.email')}
            value={authSession.user_info.emails}
          />
          <FieldView
            label={t('fields.phone')}
            value={authSession.user_info.phoneNumbers}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-title-md ">{t('company_info.title')}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-x-16 gap-y-6">
          <FieldView
            label={t('fields.taxcode')}
            value={authSession.user_info.taxcode}
          />
          <FieldView
            label={t('fields.company_name')}
            value={authSession.user_info.companyName}
          />
          <FieldView
            label={t('fields.business_sector')}
            value={authSession.user_info.businessSector}
          />
          <InputField
            name="companyAddress"
            register={regTicketForm.register}
            label={t('fields.company_address')}
            errors={regTicketForm.formState.errors.companyAddress?.message}
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-title-md ">{t('representative.title')}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-x-16 gap-y-6">
          <InputField
            name="representativeFullName"
            size="sm"
            register={regTicketForm.register}
            label={t('fields.fullName')}
            errors={
              regTicketForm.formState.errors.representativeFullName?.message
            }
            required
          />
          <InputField
            name="representativePhone"
            size="sm"
            register={regTicketForm.register}
            label={t('fields.phone')}
            errors={regTicketForm.formState.errors.representativePhone?.message}
            required
          />
          <InputField
            name="representativeEmail"
            size="sm"
            register={regTicketForm.register}
            label={t('fields.email')}
            errors={regTicketForm.formState.errors.representativeEmail?.message}
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-title-md ">{t('conection.title')}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-x-16 gap-y-6">
          <FieldView
            label={t('fields.api')}
            value={scenarioCertificate.apiName}
          />
          <FieldView
            label={t('fields.certificate')}
            value={ 
              <Button
                size="sm"
                variant="secondary"
                rounded
                type="button"
                linked
                className="font-medium"
              >
                <FileIcon className="size-5 text-black-1!" />
                {t('btn.down_cert')}
              </Button>
            }
          />
          <div className="md:col-span-2">
            <TextareaField
              name="description"
              label={t('fields.description')}
              rows={4}
              register={regTicketForm.register}
              errors={regTicketForm.formState.errors.description?.message}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 justify-end">
        <Button
          size="lg"
          type="submit"
          rounded
          fullWidth
          className="md:max-w-[343px]"
        >
          {t('btn.create')}
        </Button>
      </div>
    </ContainerFormBody>
  )
}

function FieldView({
  label,
  value,
}: Readonly<{
  label: string
  value: React.ReactNode
}>) {
  return (
    <div className="flex flex-col gap-2 text-black-1">
      <div className="text-body-emphasize">{label}</div>
      <div className="py-2.5">{value}</div>
    </div>
  )
}
