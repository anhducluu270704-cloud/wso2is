import { AUTH_ROLE, AUTH_SCOPES, AUTH_STATUS } from '@/constants/auth'
import {
  COMPANY_NAME_REGEX,
  FULL_NAME_REGEX,
  PASSWORD_REGEX,
  TAX_NUMBER_REGEX,
} from '@/constants/regex'
import { APIResponseSchema } from '@/models/api/common'
import { validateEmailSchema, validatePhoneSchema } from '@/share/lib/schema'
import {
  decodeJwtPayloadWithoutVerification,
  formatStringToArray,
} from '@/util'
import { z } from 'zod'

// Auth context type
export type AuthContextType = {
  authInfo: AuthFullInfo | null
  isLoading: boolean
  login: (
    authInfo: AuthInfoBase,
    options?: { callback?: () => void; isNotSendBroadcast?: boolean }
  ) => Promise<void>
  logout: (options?: {
    callback?: () => void
    isNotSendBroadcast?: boolean
  }) => void
  token: string | null
}

// Login
export const GetUrlLoginResponseSchema = APIResponseSchema(z.string())
export type GetUrlLoginResponse = z.infer<typeof GetUrlLoginResponseSchema>

// Get token
export const GetTokenRequestSchema = z.object({
  code: z.string(),
  redirect_uri: z.string(),
})
export type GetTokenRequest = z.infer<typeof GetTokenRequestSchema>

// Sign up
const BaseSignUpObjectSchema = z.object({
  full_name: z
    .string()
    .min(1, { message: 'error.required' })
    .transform((v) => v.trim())
    .pipe(
      z.string().refine((v) => FULL_NAME_REGEX.test(v), {
        message: 'error.signup.fullname',
      })
    ),
  password: z
    .string()
    .min(1, { message: 'error.required' })
    .transform((v) => v.trim())
    .pipe(
      z.string().refine((v) => PASSWORD_REGEX.test(v), {
        message: 'error.signup.password',
      })
    ),
  confirmPassword: z
    .string()
    .min(1, { message: 'error.required' })
    .transform((v) => v.trim()),
  account_type: z.enum(Object.keys(AUTH_SCOPES) as AUTH_ROLE[]),
  company_name: z
    .string()
    .min(1, { message: 'error.required' })
    .transform((v) => v.trim())
    .pipe(
      z
        .string()
        .max(100, { message: 'error.signup.companyname.max' })
        .refine((v) => COMPANY_NAME_REGEX.test(v), {
          message: 'error.signup.companyname.invalid',
        })
    ),
  company_email: validateEmailSchema(),
  business_type: z.string().min(1, { message: 'error.required' }),
  phone_number: validatePhoneSchema(),
  tax_code: z
    .string()
    .min(1, { message: 'error.required' })
    .transform((v) => v.trim())
    .pipe(
      z.string().refine((v) => TAX_NUMBER_REGEX.test(v), {
        message: 'error.signup.taxnumber',
      })
    ),
  tnc_accepted: z.boolean(),
})

export const BaseSignUpRequestSchema = BaseSignUpObjectSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'error.signup.confirmpassword.mismatch',
    path: ['confirmPassword'],
  }
).refine((data) => data.tnc_accepted === true, {
  message: 'error.signup.tnc',
  path: ['tnc_accepted'],
})

export type BaseSignUpRequest = z.infer<typeof BaseSignUpRequestSchema>

export const SignUpRequestSchema = BaseSignUpObjectSchema.omit({
  tnc_accepted: true,
  confirmPassword: true,
}).extend({
  recaptchaToken: z.string().min(1),
})
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>

export const SignUpDataSchema = z.object({
  verifyEmailSent: z.boolean(),
  status: z.string(),
  token: z.string(),
})
export const SignUpResponseSchema = APIResponseSchema(SignUpDataSchema)
export type SignUpResponse = z.infer<typeof SignUpResponseSchema>

//Refresh token
export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
})
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>

//Logout
export const LogoutRequestSchema = z.object({
  idToken: z.string(),
  callback: z.string(),
})
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>

export const UserDetailSchema = z.object({
  emails: z.string(),
  businessSector: z.string(),
  companyAddress: z.string().nullable().optional(),
  companyName: z.string(),
  fullName: z.string(),
  phoneNumbers: z.string(),
  representativeEmail: z.string().nullable().optional(),
  representativeMobile: z.string().nullable().optional(),
  representativeName: z.string().nullable().optional(),
  taxcode: z.string(),
  userName: z.string(),
})

export type UserDetail = z.infer<typeof UserDetailSchema>

export const ParseTokenDataSchema = z.object({
  status: z.enum(AUTH_STATUS),
})

export const ParseTokenResponseSchema = APIResponseSchema(ParseTokenDataSchema)
export type ParseTokenResponse = z.infer<typeof ParseTokenResponseSchema>

export const UserTokenDecodeSchema = z.object({
  sub: z.string(),
  aut: z.string(),
  iss: z.string(),
  client_id: z.string(),
  aud: z.string(),
  nbf: z.number(),
  azp: z.string(),
  org_id: z.string(),
  exp: z.number(),
  org_name: z.string(),
  iat: z.number(),
  jti: z.string(),
  org_handle: z.string(),
})

//Info auth
export const AuthInfoBaseSchema = z.object({
  access_token: z.string(), // Token access
  id_token: z.string(), // Token id
  expires_in: z.number(), // Thời gian hiệu lực của access_token (giây)
  refresh_token: z.string(), // Token refresh
  scope: z.string(),
  token_type: z.string(),
  user_info: UserDetailSchema,
  // refresh_expires_in: z.number(), // Thời gian hiệu lực của refresh_token (giây)
})
export type AuthInfoBase = z.infer<typeof AuthInfoBaseSchema>

export const AuthInfoBaseResponseSchema = APIResponseSchema(AuthInfoBaseSchema)

export type AuthInfoBaseResponse = z.infer<typeof AuthInfoBaseResponseSchema>
export const AuthInfoFullSchema = AuthInfoBaseSchema.transform((data) => {
  const REFRESH_OFFSET = 120 // Giây
  const now = Date.now()
  const refresh_at = now + (data.expires_in - REFRESH_OFFSET) * 1000

  const user = UserTokenDecodeSchema.parse(
    decodeJwtPayloadWithoutVerification(data.access_token)
  )
  const role =
    (Object.keys(AUTH_SCOPES).find((role) =>
      formatStringToArray(data.scope).includes(AUTH_SCOPES[role as AUTH_ROLE])
    ) as AUTH_ROLE) ?? undefined

  return { ...data, user, refresh_at, role }
})
export type AuthFullInfo = z.infer<typeof AuthInfoFullSchema>

export const VerifyTokenResponseSchema = APIResponseSchema(
  z.object({
    status: z.enum(['expired', 'verified']),
  })
)
export type VerifyTokenResponse = z.infer<typeof VerifyTokenResponseSchema>
