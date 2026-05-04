'use client'

import { useUpdateApplicationMutation } from '@/services/application/application.mutations'
import {
  ApplicationRequest,
  ApplicationRequestSchema,
} from '@/services/application/application.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

export const useApplicationUpdateForm = (id: string, onSuccess: () => void) => {
  const form = useForm<ApplicationRequest>({
    resolver: zodResolver(ApplicationRequestSchema),
  })

  const updateMutation = useUpdateApplicationMutation(id)

  const handleSubmit: SubmitHandler<ApplicationRequest> = (data) => {
    updateMutation.mutate(data, {
      onSettled: () => onSuccess(),
    })
  }

  return {
    form,
    handleSubmit,
    updateMutation,
  }
}
