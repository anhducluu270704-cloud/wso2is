import { z } from 'zod'

export const GoogleSiteVerifyResponseSchema = z.object({
  success: z.boolean(),
  score: z.number().optional(),
  action: z.string().optional(),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
  'error-codes': z.array(z.string()).optional(),
})

export type GoogleSiteVerifyResponse = z.infer<
  typeof GoogleSiteVerifyResponseSchema
>

export const RecaptchaSiteVerifyFormSchema = z.object({
  secret: z.string().min(1),
  response: z.string().min(1),
})

export type RecaptchaSiteVerifyForm = z.infer<
  typeof RecaptchaSiteVerifyFormSchema
>

export const RecaptchaVerifyRequestSchema = z.object({
  token: z.string().min(1),
})

export type RecaptchaVerifyRequest = z.infer<
  typeof RecaptchaVerifyRequestSchema
>

export const VerifyRecaptchaSuccessJsonSchema = z.object({
  success: z.literal(true),
  score: z.number().optional(),
  action: z.string().optional(),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
})

export type VerifyRecaptchaSuccessJson = z.infer<
  typeof VerifyRecaptchaSuccessJsonSchema
>

export const VerifyRecaptchaErrorJsonSchema = z.object({
  success: z.literal(false),
  error: z.string().optional(),
  errorCodes: z.array(z.string()).optional(),
  errorDescriptions: z.array(z.string()).optional(),
  score: z.number().optional(),
  minScore: z.number().optional(),
})

export type VerifyRecaptchaErrorJson = z.infer<
  typeof VerifyRecaptchaErrorJsonSchema
>

export type VerifyRecaptchaOutcome =
  | { ok: true; body: VerifyRecaptchaSuccessJson }
  | { ok: false; status: number; body: VerifyRecaptchaErrorJson }
