import { useRouter } from '@/i18n/navigation'
import { BaseAPIResponse } from '@/models/api/common'
import { useAuth } from '@/providers/auth-provider'
import { useGetUrlLoginMutation } from '@/share/layout/end-user/header/hook'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import {
  AuthInfoBaseResponse,
  AuthInfoBaseSchema,
  GetTokenRequest,
  SignUpRequest,
  SignUpResponse,
} from './auth.schema'
import authApi from './auth.service'

export const useGetTokenMutation = () => {
  const { login } = useAuth()
  const router = useRouter()
  const mutate = useGetUrlLoginMutation()
  return useMutation<
    AuthInfoBaseResponse,
    AxiosError<BaseAPIResponse>,
    GetTokenRequest
  >({
    mutationFn: (formData) => {
      return authApi.getToken(formData)
    },
    onSuccess: (data) => {
      toast.dismiss()
      const user = AuthInfoBaseSchema.safeParse(data.data)
      if (user.error) {
        mutate.mutate()
      }
      login(data.data, { callback: () => router.push('/') })
    },
    onError: () => {
      mutate.mutate()
    },
  })
}

export const useSignUpMutation = () => {
  const t = useTranslations('signup')
  const router = useRouter()
  return useMutation<
    SignUpResponse,
    AxiosError<BaseAPIResponse>,
    SignUpRequest
  >({
    mutationFn: (formData) => {
      return authApi.signUp(formData)
    },

    onMutate: () => {
      toast.dismiss()
      toast.loading(t('mess.signup.loading'))
    },
    onSuccess: (data) => {
      toast.dismiss()
      toast.success(t('mess.signup.success'))
      router.replace('/signup?token=' + data.data.token)
    },
    onError: () => {
      toast.dismiss()
    },
  })
}
