import { REGTICKET_DESCRIPTION_MAX_LENGTH } from '@/constants/reg-ticket'
import { COMPANY_ADDRESS_REGEX, FULL_NAME_REGEX } from '@/constants/regex'
import { APIResponseSchema } from '@/models/api/common'
import { validateEmailSchema, validatePhoneSchema } from '@/share/lib/schema'
import { z } from 'zod'

export const RegTicketDetailSchema = z.object({
  id: z.string(),
  code: z.string(),
  tppId: z.string(),
  company: z.string(),
  taxCode: z.string(),
  email: z.string(),
  fullName: z.string(),
  phone: z.string(),
  userName: z.string(),
  role: z.string(),
  applicationName: z.string(),
  applicationId: z.string(),
  keyMappingId: z.string(),
  consumerKey: z.string(),
  description: z.string(),
  status: z.string(),
  internalComment: z.string(),
  rejectComment: z.string(),
  statusUpdatedAt: z.string(),
  statusUpdatedBy: z.string(),
  workflowInstanceId: z.string(),
  goliveId: z.string(),
  golivedAt: z.string(),
  domain: z.string(),
  domainIs: z.string(),
  ip: z.string(),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedBy: z.string(),
  updatedAt: z.string(),
  businessField: z.string(),
  companyAddress: z.string(),
  testCertificate: z.string(),
  attachment: z
    .object({
      name: z.string(),
      type: z.string(),
      size: z.number(),
    })
    .array()
    .optional(),
})

export type RegTicketDetail = z.infer<typeof RegTicketDetailSchema>

export const GetRegTicketDetailResponseSchema = APIResponseSchema(
  RegTicketDetailSchema
)

export type GetRegTicketDetailResponse = z.infer<
  typeof GetRegTicketDetailResponseSchema
>

export const CreateRegTicketRequestSchema = z.object({
  fullName: z.string().min(1, { message: 'error.required' }),
  email: z.string().min(1, { message: 'error.required' }),
  phone: z.string().min(1, { message: 'error.required' }),
  taxCode: z.string().min(1, { message: 'error.required' }),
  company: z.string().min(1, { message: 'error.required' }),
  role: z.string().min(1, { message: 'error.required' }),
  companyAddress: z
    .string()
    .min(1, { message: 'error.required' })
    .transform((v) => v.trim())
    .pipe(
      z
        .string()
        .min(5, { message: 'error.reg_ticket.company_address.length' })
        .max(200, { message: 'error.reg_ticket.company_address.length' })
        .refine((v) => COMPANY_ADDRESS_REGEX.test(v), {
          message: 'error.reg_ticket.company_address.invalid',
        })
    ),
  representativeFullName: z
    .string()
    .min(1, { message: 'error.required' })
    .transform((v) => v.trim())
    .pipe(
      z.string().refine((v) => FULL_NAME_REGEX.test(v), {
        message: 'error.signup.fullname',
      })
    ),
  representativePhone: validatePhoneSchema({
    length: 'error.reg_ticket.representative_phone.length',
    invalid: 'error.reg_ticket.representative_phone.invalid',
  }),
  representativeEmail: validateEmailSchema({
    length: 'error.reg_ticket.representative_email.length',
    invalid: 'error.reg_ticket.representative_email.invalid',
  }),
  apiId: z.string().min(1, { message: 'error.required' }),
  apiName: z.string().min(1, { message: 'error.required' }),
  testCertificate: z.string().min(1, { message: 'error.required' }),
  description: z.optional(
    z
      .string()
      .transform((v) => v.trim())
      .pipe(
        z.string().max(REGTICKET_DESCRIPTION_MAX_LENGTH, {
          message: 'error.reg_ticket.description.length',
        })
      )
  ),
  applicationId: z.string().min(1, { message: 'error.required' }),
})

export type CreateRegTicketRequest = z.infer<
  typeof CreateRegTicketRequestSchema
>
