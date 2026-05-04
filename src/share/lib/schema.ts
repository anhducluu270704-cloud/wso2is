import {
  COMPANY_EMAIL_MAX_LENGTH,
  COMPANY_EMAIL_MIN_LENGTH,
  EMAIL_FORMAT_REGEX,
  INPUT_EMPTY_REGEX,
  MOBILE_NUMBER_DIGITS_ONLY_REGEX,
  MOBILE_NUMBER_MAX_LENGTH,
  MOBILE_NUMBER_MIN_LENGTH,
  MOBILE_NUMBER_REGEX,
} from '@/constants/regex'
import { z } from 'zod'

export type ValidateEmailMessages = {
  required: string
  length: string
  invalid: string
}

export type ValidatePhoneMessages = {
  required: string
  length: string
  invalid: string
}

export const DEFAULT_VALIDATE_EMAIL_MESSAGES: ValidateEmailMessages = {
  required: 'error.required',
  length: 'error.signup.companyemail.length',
  invalid: 'error.signup.companyemail.invalid',
}

export const DEFAULT_VALIDATE_PHONE_MESSAGES: ValidatePhoneMessages = {
  required: 'error.required',
  length: 'error.signup.mobilenumber.length',
  invalid: 'error.signup.mobilenumber.invalid',
}

export const validateEmailSchema = (
  messages?: Partial<ValidateEmailMessages>
) => {
  const m = { ...DEFAULT_VALIDATE_EMAIL_MESSAGES, ...messages }
  return z
    .string()
    .min(1, { message: m.required })
    .transform((v) => v.trim())
    .pipe(
      z
        .string()
        .min(COMPANY_EMAIL_MIN_LENGTH, { message: m.length })
        .max(COMPANY_EMAIL_MAX_LENGTH, { message: m.length })
        .regex(EMAIL_FORMAT_REGEX, { message: m.invalid })
        .refine((v) => !INPUT_EMPTY_REGEX.test(v), {
          message: m.required,
        })
    )
}

export const validatePhoneSchema = (
  messages?: Partial<ValidatePhoneMessages>
) => {
  const m = { ...DEFAULT_VALIDATE_PHONE_MESSAGES, ...messages }
  return z
    .string()
    .min(1, { message: m.required })
    .transform((v) => v.trim())
    .pipe(
      z
        .string()
        .regex(MOBILE_NUMBER_DIGITS_ONLY_REGEX, { message: m.invalid })
        .min(MOBILE_NUMBER_MIN_LENGTH, { message: m.length })
        .max(MOBILE_NUMBER_MAX_LENGTH, { message: m.length })
        .regex(MOBILE_NUMBER_REGEX, { message: m.invalid })
        .refine((v) => !INPUT_EMPTY_REGEX.test(v), {
          message: m.required,
        })
    )
}
