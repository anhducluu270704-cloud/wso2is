import { useSignUpMutation } from '@/services/auth/auth.mutations'
import {
  BaseSignUpRequest,
  BaseSignUpRequestSchema,
  SignUpRequestSchema,
} from '@/services/auth/auth.schema'
import { verifyRecaptchaOnServer } from '@/services/recaptcha/recaptcha.client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const RECAPTCHA_ACTION = 'signup'

export const useSignUpForm = () => {
  const t = useTranslations('signup')
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null)

  const signUpForm = useForm<BaseSignUpRequest>({
    resolver: zodResolver(BaseSignUpRequestSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      account_type: 'DEVELOPER',
      business_type: 'FINANCE',
      tnc_accepted: false,
    },
  })

  const mutation = useSignUpMutation()

  const handleFormSubmit: SubmitHandler<BaseSignUpRequest> = useCallback(
    async (data) => {
      setRecaptchaError(null)

      let recaptchaToken: string | null = null
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha(RECAPTCHA_ACTION)
        } catch {
          setRecaptchaError(t('recaptcha.execute_error'))
          return
        }
      }

      if (!recaptchaToken) {
        setRecaptchaError(t('recaptcha.no_token'))
        return
      }

      const verifyResult = await verifyRecaptchaOnServer(recaptchaToken)
      if (!verifyResult.ok) {
        if (
          verifyResult.reason === 'network' ||
          verifyResult.reason === 'invalid_response'
        ) {
          setRecaptchaError(t('recaptcha.verify_failed'))
          return
        }
        const message =
          verifyResult.error === 'reCAPTCHA score too low'
            ? t('recaptcha.score_low')
            : verifyResult.error ?? t('recaptcha.verify_failed')
        setRecaptchaError(message)
        return
      }

      const { tnc_accepted: _tnc, confirmPassword: _cp, ...rest } = data
      const parsed = SignUpRequestSchema.parse({
        ...rest,
        recaptchaToken,
      })
      mutation.mutate(parsed)
    },
    [executeRecaptcha, mutation, t],
  )

  return { signUpForm, handleFormSubmit, mutation, recaptchaError }
}
