import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { BaseAPIResponse } from '@/models/api/common'
import supportApi from './support.service'
import { SupportRequest } from './support.schema'

export const useSupportRequestMutation = () => {
  const t = useTranslations('support')

  return useMutation<
    BaseAPIResponse,
    AxiosError<BaseAPIResponse>,
    SupportRequest
  >({
    mutationFn: (body) => supportApi.create(body),
    onMutate: () => {
      toast.dismiss()
      toast.loading(t('toast.loading'))
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(t('toast.success'))
    },
    onError: (error) => {
      toast.dismiss()
      toast.error(error.response?.data?.error)
    },
  })
}
