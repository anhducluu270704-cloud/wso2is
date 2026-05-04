'use client'

import {
  ApplicationRequest,
  ApplicationRequestSchema,
} from '@/services/application/application.schema'
import { useCreateApplicationMutation } from '@/services/application/application.mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

export const useApplicationForm = (options: { onSuccess: () => void }) => {
  const form = useForm<ApplicationRequest>({
    resolver: zodResolver(ApplicationRequestSchema),
    defaultValues: {
      name: '',
      description: '',
      throttlingPolicy: 'Unlimited',
    },
  })

  const createMutation = useCreateApplicationMutation()

  const handleSubmit: SubmitHandler<ApplicationRequest> = (data) => {
    const payload: ApplicationRequest = data

    createMutation.mutate(payload, {
      onSuccess: () => options.onSuccess(),
    })
  }

  return {
    form,
    handleSubmit,
    createMutation,
  }
}

