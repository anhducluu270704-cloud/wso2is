import { BaseAPIResponse } from '@/models/api/common'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { applicationKeys } from './application.query-options'
import {
  ApplicationRequest,
  GenerateAccessTokenDetail,
  GenerateKeysRequest,
  GenerateKeysResponse,
  GetApplicationDetailResponse,
  GetApplicationSubscriptionsResponse,
  RevokeAccessTokenRequest,
  SubscribeApiRequest,
  SubscribeApiResponse,
  UpdateConfigurationRequest,
} from './application.schema'
import applicationApi from './application.service'

export const useCreateApplicationMutation = () => {
  const queryClient = useQueryClient()
  const t = useTranslations('application')
  return useMutation<
    GetApplicationDetailResponse,
    AxiosError<BaseAPIResponse>,
    ApplicationRequest
  >({
    mutationFn: (body) => applicationApi.create(body),
    onMutate: () => {
      toast.dismiss()
      toast.loading(t('mess.create.loading'))
    },
    onSuccess: () => {
      toast.dismiss()
      queryClient.invalidateQueries({
        queryKey: applicationKeys.all,
      })
    },
    onError: (error) => {
      toast.dismiss()
    },
  })
}

export type UseSubscribeApiMutation = {
  onSuccess?: (message: string, options?: { durationMs?: number }) => void
  onError?: (message: string, options?: { durationMs?: number }) => void
}

export const useSubscribeApiMutation = (
  applicationName?: string,
  callbacks?: UseSubscribeApiMutation
) => {
  const queryClient = useQueryClient()
  const t = useTranslations('application')
  const useInlineToast = Boolean(callbacks?.onSuccess ?? callbacks?.onError)

  return useMutation<
    SubscribeApiResponse,
    AxiosError<BaseAPIResponse>,
    { applicationId: string; body: SubscribeApiRequest }
  >({
    mutationFn: ({ applicationId, body }) =>
      applicationApi.subscribe(applicationId, body),
    onMutate: () => {
      if (!useInlineToast) {
        toast.dismiss()
        toast.loading(t('mess.subscribe.loading'))
      }
    },
    onSuccess: (data, variables) => {
      toast.dismiss()
      const message = t('mess.subscribe.success', {
        name: applicationName ?? variables.applicationId,
      })
      if (callbacks?.onSuccess) {
        callbacks.onSuccess(message)
      } else {
        toast.success(message)
      }
      queryClient.invalidateQueries({ queryKey: applicationKeys.all })
    },
    onError: (error) => {
      toast.dismiss()
      const durationMs =
        error.response?.data &&
        typeof error.response.data === 'object' &&
        'toastDurationMs' in error.response.data
          ? Number(
              (error.response.data as { toastDurationMs?: number })
                .toastDurationMs
            )
          : undefined
      if (callbacks?.onError) {
        callbacks.onError(
          error.response?.data?.error ?? t('mess.subscribe.error'),
          {
            durationMs,
          }
        )
      } else {
        toast.error(error.response?.data?.error ?? t('mess.subscribe.error'))
      }
    },
  })
}

export const useDeleteApplicationMutation = () => {
  const queryClient = useQueryClient()
  const t = useTranslations('application')

  return useMutation<BaseAPIResponse, AxiosError<BaseAPIResponse>, string>({
    mutationFn: (id) => applicationApi.delete(id),
    onMutate: () => {
      toast.dismiss()
      toast.loading(t('mess.delete.loading'))
    },
    onSuccess: () => {
      toast.dismiss()
      queryClient.invalidateQueries({
        queryKey: applicationKeys.all,
      })
    },
    onError: (error) => {
      toast.dismiss()
      toast.error(error.response?.data?.error ?? t('mess.delete.error'))
    },
  })
}

export const useDeleteSubscriptionMutation = () => {
  const queryClient = useQueryClient()
  const t = useTranslations('application')

  return useMutation<
    BaseAPIResponse,
    AxiosError<BaseAPIResponse>,
    { applicationId: string; subscriptionId: string },
    { previous?: GetApplicationSubscriptionsResponse }
  >({
    mutationFn: ({ subscriptionId }) =>
      applicationApi.deleteSubscription(subscriptionId),
    onMutate: ({ applicationId, subscriptionId }) => {
      const previous =
        queryClient.getQueryData<GetApplicationSubscriptionsResponse>(
          applicationKeys.subscriptions(applicationId)
        )

      queryClient.setQueryData<GetApplicationSubscriptionsResponse>(
        applicationKeys.subscriptions(applicationId),
        (old) => {
          if (!old?.data) return old as GetApplicationSubscriptionsResponse

          const list = old.data.list.filter(
            (subscription) => subscription.subscriptionId !== subscriptionId
          )

          return {
            ...old,
            data: {
              ...old.data,
              count: list.length,
              list,
              pagination: {
                ...old.data.pagination,
                total: list.length,
              },
            },
          }
        }
      )

      toast.dismiss()
      toast.loading(t('mess.delete_subscription.loading'))

      return { previous }
    },
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          applicationKeys.subscriptions(variables.applicationId),
          context.previous
        )
      }
      toast.dismiss()
      toast.error(
        error.response?.data?.error ?? t('mess.delete_subscription.error')
      )
    },
    onSuccess: (_data, variables) => {
      toast.dismiss()
      toast.success(t('mess.delete_subscription.success'))
      queryClient.invalidateQueries({
        queryKey: applicationKeys.all,
      })
    },
  })
}

export const useUpdateApplicationMutation = (id: string) => {
  const queryClient = useQueryClient()
  const t = useTranslations('application')

  return useMutation<
    BaseAPIResponse,
    AxiosError<BaseAPIResponse>,
    ApplicationRequest,
    { previous?: GetApplicationDetailResponse }
  >({
    mutationFn: (body) => applicationApi.update(id, body),
    onMutate: (body) => {
      const previous = queryClient.getQueryData<GetApplicationDetailResponse>(
        applicationKeys.detail(id)
      )

      queryClient.setQueryData<GetApplicationDetailResponse>(
        applicationKeys.detail(id),
        (old) => {
          if (!old?.data) return old as GetApplicationDetailResponse
          return {
            ...old,
            data: {
              ...old.data,
              ...body,
            },
          }
        }
      )

      toast.dismiss()
      toast.loading(t('mess.update.loading'))

      return { previous }
    },
    onError: (error, body, context) => {
      if (context?.previous) {
        queryClient.setQueryData(applicationKeys.detail(id), context.previous)
      }
      toast.dismiss()
      toast.error(error.response?.data?.error ?? t('mess.update.error'))
    },
    onSuccess: (_data, body) => {
      toast.dismiss()
      toast.success(t('mess.update.success', { name: body.name }))
      queryClient.invalidateQueries({
        queryKey: applicationKeys.all,
      })
    },
  })
}

export const useGenerateKeysMutation = (applicationId: string) => {
  const t = useTranslations('application')
  const queryClient = useQueryClient()
  return useMutation<
    GenerateKeysResponse,
    AxiosError<BaseAPIResponse>,
    GenerateKeysRequest
  >({
    mutationFn: (body) => {
      return applicationApi.generateKeys(applicationId, body)
    },
    onMutate: () => {
      toast.dismiss()
      toast.loading(t('mess.generate_keys.loading'))
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(t('mess.generate_keys.success'))
      queryClient.invalidateQueries({
        queryKey: applicationKeys.all,
      })
    },
    onError: (error) => {
      toast.dismiss()
      toast.error(error.response?.data?.error ?? t('mess.generate_keys.error'))
    },
  })
}

export const useUpdateConfigurationMutation = (
  applicationId: string,
  oauthKeyId: string
) => {
  const t = useTranslations('application')
  const queryClient = useQueryClient()
  return useMutation<
    GenerateKeysResponse,
    AxiosError<BaseAPIResponse>,
    UpdateConfigurationRequest
  >({
    mutationFn: (body) => {
      return applicationApi.updateConfiguration(applicationId, oauthKeyId, body)
    },
    onMutate: () => {
      toast.dismiss()
      toast.loading(t('mess.update_keys_config.loading'))
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(t('mess.update_keys_config.success'))
      queryClient.invalidateQueries({
        queryKey: applicationKeys.all,
      })
    },
    onError: (error) => {
      toast.dismiss()
      toast.error(
        error.response?.data?.error ?? t('mess.update_keys_config.error')
      )
    },
  })
}

export const useDeleteOAuthKeyMutation = (
  applicationId: string,
  oauthKeyId: string
) => {
  const queryClient = useQueryClient()
  const t = useTranslations('application')

  return useMutation<BaseAPIResponse, AxiosError<BaseAPIResponse>>({
    mutationFn: () => applicationApi.deleteOAuthKey(applicationId, oauthKeyId),
    onMutate: () => {
      toast.dismiss()
      toast.loading(t('mess.delete_oauth_key.loading'))
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(t('mess.delete_oauth_key.success'))
      queryClient.invalidateQueries({
        queryKey: applicationKeys.all,
      })
    },
    onError: (error) => {
      toast.dismiss()
      toast.error(
        error.response?.data?.error ?? t('mess.delete_oauth_key.error')
      )
    },
  })
}

export const useGenerateAccessTokenMutation = (
  applicationId: string,
  oauthKeyId: string
) => {
  const queryClient = useQueryClient()
  const t = useTranslations('application')

  return useMutation<
    GenerateAccessTokenDetail,
    AxiosError<BaseAPIResponse>,
    RevokeAccessTokenRequest
  >({
    mutationFn: (body) =>
      applicationApi.generateAccessToken(applicationId, oauthKeyId, body),
    onMutate: () => {
      toast.dismiss()
      toast.loading(t('mess.generate_access_token.loading'))
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(t('mess.generate_access_token.success'))
      queryClient.invalidateQueries({
        queryKey: applicationKeys.all,
      })
    },
    onError: (error) => {
      toast.dismiss()
      toast.error(
        error.response?.data?.error ?? t('mess.generate_access_token.error')
      )
    },
  })
}
