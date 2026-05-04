'use client'

import { UserDetail } from '@/services/auth/auth.schema'
import { useCreateRegTicketMutation } from '@/services/reg-ticket/regTicket.mutations'
import {
  CreateRegTicketRequest,
  CreateRegTicketRequestSchema,
} from '@/services/reg-ticket/regTicket.schema'
import { ScenarioCertificateDetail } from '@/services/scenario/scenario.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

export type UseRegTicketFormOptions = {
  authSession: UserDetail
  scenarioCertificate: ScenarioCertificateDetail
}

export const useRegTicketForm = ({
  authSession,
  scenarioCertificate,
}: UseRegTicketFormOptions) => {
  const regTicketForm = useForm<CreateRegTicketRequest>({
    resolver: zodResolver(CreateRegTicketRequestSchema),
    defaultValues: {
      fullName: authSession.fullName,
      email: authSession.emails,
      phone: authSession.phoneNumbers,
      taxCode: authSession.taxcode,
      company: authSession.companyName,
      role: authSession.businessSector,
      companyAddress: authSession.companyAddress ?? '',
      representativeFullName: authSession.representativeName ?? '',
      representativePhone: authSession.representativeMobile ?? '',
      representativeEmail: authSession.representativeEmail ?? '',
      apiId: scenarioCertificate.apiId,
      testCertificate: scenarioCertificate.id,
      applicationId: scenarioCertificate.applicationId,
      apiName: scenarioCertificate.apiName,
      description: '',
    },
  })

  const mutation = useCreateRegTicketMutation()

  const onSubmit: SubmitHandler<CreateRegTicketRequest> = (data) => {
    const formData = CreateRegTicketRequestSchema.parse(data)
    mutation.mutate(formData)
  }

  return {
    regTicketForm,
    onSubmit,
    mutation,
  }
}
