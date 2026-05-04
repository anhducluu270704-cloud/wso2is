import CreateRegTicketWrapper from '@/components/regTicket/create'
import CertificateStatus from '@/components/regTicket/status'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('layout')

  return {
    title: t('header.reg_ticket'),
    description: '',
  }
}

export default async function CreateApplicationPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    scenario_id: string
    version_id: string
    application_id: string
    api_id: string
    ticket_id: string
  }>
}>) {
  const { scenario_id, version_id, application_id, api_id, ticket_id } =
    await searchParams

  if (ticket_id) {
    return <CertificateStatus />
  } else if (!scenario_id || !version_id || !application_id || !api_id)
    return notFound()

  return (
    <CreateRegTicketWrapper
      scenario_id={scenario_id}
      version_id={version_id}
      application_id={application_id}
      api_id={api_id}
    />
  )
}
