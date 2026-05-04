import LoadingPage from '@/share/components/full-page/loading'
import { useRouter } from '@/i18n/navigation'
import { BaseAPIResponse } from '@/models/api/common'
import { GetUrlLoginResponse } from '@/services/auth/auth.schema'
import authApi from '@/services/auth/auth.service'
import { buildLoginUrlWithUiLang } from '@/share/hooks/login-redirect'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useGetUrlLoginMutation = () => {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('login')
  return useMutation<GetUrlLoginResponse, AxiosError<BaseAPIResponse>>({
    mutationFn: () =>
      authApi.signIn(`${window.location.origin}/${locale}/get-token`),
    onMutate: () => {
      return <LoadingPage />
    },
    onError: (error) => {
      toast.error(error.response?.data?.error ?? t('mess.signin.error'))
    },
    onSuccess: (data) => {
      router.push(buildLoginUrlWithUiLang(data.data))
    },
  })
}
