'use client'

import {
  SupportRequest,
  SupportRequestSchema ,
} from '@/services/support/support.schema'
import { useSupportRequestMutation } from '@/services/support/support.mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

export const defaultValues: SupportRequest = {
  full_name: '',
  email: '',
  company_name: '',
  phone_number: '',
  request_type: '',
  description: '',
}

export type UseSupportRequestFormOptions = Readonly<{
  onSuccess: () => void
}>

export function useSupportRequestForm({
  onSuccess,
}: Readonly<UseSupportRequestFormOptions>) {
  const form = useForm<SupportRequest>({
    resolver: zodResolver(SupportRequestSchema ),
    defaultValues,
    mode: 'onSubmit',
  })
  const mutation = useSupportRequestMutation()

  const onSubmit: SubmitHandler<SupportRequest> = (data) => {
    const formData = SupportRequestSchema .parse(data)
    mutation.mutate(formData, {
      onSuccess: () => {
        form.reset(defaultValues)
        onSuccess()
      },
    })
  }

  return {
    form,
    onSubmit,
    mutation,
  }
}
