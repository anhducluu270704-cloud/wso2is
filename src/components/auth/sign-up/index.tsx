'use client'

import { PASSWORD_REQUIREMENT_KEYS } from '@/constants/password'
import { Link } from '@/i18n/navigation'
import { useGetUrlLoginMutation } from '@/share/layout/end-user/header/hook'
import ContainerFormBody from '@/share/components/form'
import InputField from '@/share/components/input'
import InputSelectField from '@/share/components/input/select'
import RadioGroupField from '@/share/components/radio'
import { Button } from '@/share/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/share/ui/card'
import { Checkbox } from '@/share/ui/checkbox'
import { getPasswordChecks } from '@/util/password-validation'
import { Controller } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useBusinessSectorOptions } from '@/share/hooks/use-business-sector-options'
import { useSignUpForm } from './hook'

export default function SignUpWrapper() {
  const t = useTranslations('signup')
  const tForm = useTranslations('form')
  const loginMutation = useGetUrlLoginMutation()
  const { sectorSelectOptions } = useBusinessSectorOptions()
  const { signUpForm, handleFormSubmit, recaptchaError, mutation } =
    useSignUpForm()
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const passwordValue = signUpForm.watch('password') ?? ''
  const confirmPasswordValue = signUpForm.watch('confirmPassword') ?? ''
  const passwordChecks = getPasswordChecks(passwordValue)
  const isConfirmPasswordMismatch =
    Boolean(confirmPasswordValue) && passwordValue !== confirmPasswordValue

  const confirmPasswordErrorMessage =
    signUpForm.formState.errors.confirmPassword?.message ??
    (isConfirmPasswordMismatch
      ? tForm('error.signup.confirmpassword.mismatch')
      : undefined)

  return (
    <Card
      size="xl"
      className="flex w-full lg:max-w-[944px] max-h-[calc(100vh-15rem)] flex-col rounded-2xl gap-9"
    >
      <CardHeader>
        <h1 className="text-center text-title-lg-emphasize lg:text-left">
          {t('form.title')}
        </h1>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto pr-2">
        <ContainerFormBody
          onSubmit={signUpForm.handleSubmit(handleFormSubmit)}
          errorMessage={
            mutation.error?.response?.data?.error ?? recaptchaError ?? undefined
          }
        >
          <div className="grid gap-6 md:grid-cols-2 md:items-start">
            <div className="md:col-span-2">
              <RadioGroupField
                name="account_type"
                control={signUpForm.control}
                options={[
                  { value: 'DEVELOPER', label: t('fields.radio.developer') },
                  {
                    value: 'BUSINESS_OWNER',
                    label: t('fields.radio.business-owner'),
                  },
                ]}
              />
            </div>
            <InputField
              name="full_name"
              size="sm"
              required
              register={signUpForm.register}
              label={t('fields.fullname')}
              variant={
                signUpForm.formState.errors.full_name?.message
                  ? 'error'
                  : 'default'
              }
              errors={signUpForm.formState.errors.full_name?.message}
            />
            <InputField
              name="phone_number"
              required
              size="sm"
              register={signUpForm.register}
              label={t('fields.mobilenumber')}
              variant={
                signUpForm.formState.errors.phone_number?.message
                  ? 'error'
                  : 'default'
              }
              errors={signUpForm.formState.errors.phone_number?.message}
            />

            <InputField
              name="company_name"
              required
              size="sm"
              register={signUpForm.register}
              label={t('fields.companyname')}
              variant={
                signUpForm.formState.errors.company_name?.message
                  ? 'error'
                  : 'default'
              }
              errors={signUpForm.formState.errors.company_name?.message}
            />
            <InputField
              name="company_email"
              required
              size="sm"
              register={signUpForm.register}
              label={t('fields.companyemail')}
              variant={
                signUpForm.formState.errors.company_email?.message
                  ? 'error'
                  : 'default'
              }
              errors={signUpForm.formState.errors.company_email?.message}
            />
            <InputSelectField
              name="business_type"
              control={signUpForm.control}
              label={t('fields.business_sector.label')}
              selectContentPosition="popper"
              selectContentAlign="start"
              options={sectorSelectOptions}
              size="sm"
              errors={signUpForm.formState.errors.business_type?.message}
            />
            <InputField
              name="tax_code"
              required
              size="sm"
              register={signUpForm.register}
              label={t('fields.taxnumber')}
              variant={
                signUpForm.formState.errors.tax_code?.message
                  ? 'error'
                  : 'default'
              }
              errors={signUpForm.formState.errors.tax_code?.message}
            />
            <div className="flex flex-col gap-2">
              <InputField
                name="password"
                type="password"
                size="sm"
                required
                register={signUpForm.register}
                label={t('fields.password')}
                variant={
                  signUpForm.formState.errors.password?.message
                    ? 'error'
                    : 'default'
                }
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                errors={signUpForm.formState.errors.password?.message}
              />
              {isPasswordFocused && (
                <div className="md:col-span-2">
                  <ul className="space-y-1 text-body-helptext">
                    {PASSWORD_REQUIREMENT_KEYS.map((key) => {
                      const ok = passwordChecks[key]
                      return (
                        <li key={key} className="flex items-center gap-2">
                          <span>
                            {ok ? (
                              <span className="text-green-1">✓</span>
                            ) : (
                              <span className="text-grey-5">•</span>
                            )}
                          </span>
                          <span className={ok ? 'text-green-1' : ''}>
                            {t(`rules.${key}`)}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <InputField
                name="confirmPassword"
                type="password"
                size="sm"
                required
                register={signUpForm.register}
                label={t('fields.confirmpassword.label')}
                variant={confirmPasswordErrorMessage ? 'error' : 'default'}
                errors={confirmPasswordErrorMessage}
              />
              {confirmPasswordValue && !isConfirmPasswordMismatch ? (
                <p className="text-body-helptext text-xs leading-[18px] text-green-1">
                  {t('fields.confirmpassword.match')}
                </p>
              ) : null}
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <div className="flex items-start gap-2 text-body-link">
                <Controller
                  name="tnc_accepted"
                  control={signUpForm.control}
                  render={({ field }) => (
                    <Checkbox
                      id="tnc"
                      className="mt-0.5 aria-invalid:ring-0 aria-invalid:ring-offset-0 aria-invalid:focus-visible:ring-0"
                      checked={!!field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true)
                      }}
                      aria-invalid={!!signUpForm.formState.errors.tnc_accepted}
                    />
                  )}
                />
                <div className="flex flex-wrap items-center gap-1">
                  <span>{t('legal.agreeprefix')}</span>
                  <Link
                    href="https://techcombank.com/en/help-support/privacy-policy"
                    className="underline"
                  >
                    {t('legal.terms')}
                  </Link>
                </div>
              </div>
              {signUpForm.formState.errors.tnc_accepted?.message ? (
                <p className="text-body-helptext text-destructive pl-7">
                  {tForm.has(signUpForm.formState.errors.tnc_accepted.message)
                    ? tForm(signUpForm.formState.errors.tnc_accepted.message)
                    : signUpForm.formState.errors.tnc_accepted.message}
                </p>
              ) : null}
            </div>
          </div>
        </ContainerFormBody>
      </CardContent>
      <CardFooter className="md:col-span-2 sticky bottom-0 mt-auto flex flex-col pt-0! gap-4 bg-card md:flex-row md:items-center md:justify-between">
        <div className="text-body-emphasize flex flex-wrap items-center gap-1">
          {t('form.hint')}
          <Button
            type="button"
            variant="ghost"
            linked
            className="h-auto min-h-0 p-0 text-body-link font-bold text-blue-3 hover:underline disabled:pointer-events-none disabled:opacity-60"
            disabled={loginMutation.isPending}
            onClick={() => loginMutation.mutate()}
          >
            {t('btn.login')}
          </Button>
        </div>
        <Button
          rounded
          size="sm"
          fullWidth
          className="md:max-w-[200px]"
          onClick={() => signUpForm.handleSubmit(handleFormSubmit)()}
        >
          {t('btn.signup')}
        </Button>
      </CardFooter>
    </Card>
  )
}
