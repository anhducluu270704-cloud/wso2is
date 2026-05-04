import { BaseAPIResponse } from '@/models/api/common'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import {
  CreateRegTicketRequest,
  GetRegTicketDetailResponse,
} from './regTicket.schema'
import regTicketApi from './regTicket.service'
import { useRouter } from '@/i18n/navigation'

export type UseUploadCertificateFormProps = Readonly<{
  onSuccess: () => void
}>

export const useCreateRegTicketMutation = () => {
  const queryClient = useQueryClient()
  const t = useTranslations('regTicket')
  const router = useRouter()
  return useMutation<
    GetRegTicketDetailResponse,
    AxiosError<BaseAPIResponse>,
    CreateRegTicketRequest
  >({
    mutationFn: (body) => regTicketApi.create(body),
    onMutate: () => {
      toast.dismiss()
      toast.loading(t('mess.create.loading'))
    },
    onSuccess: (data) => {
      toast.dismiss()
      queryClient.invalidateQueries()
      router.push(`/reg-ticket/create?ticket_id=${data.data.id}`)
    },
    onError: (error) => {
      toast.dismiss()
      toast.error(error.response?.data?.error ?? t('mess.create.error'))
    },
  })
}
