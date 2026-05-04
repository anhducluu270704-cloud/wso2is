import { RECAPTCHA_VERIFY_API_PATH } from '@/constants/recaptcha'
import { z } from 'zod'

import {
  VerifyRecaptchaErrorJsonSchema,
  VerifyRecaptchaSuccessJsonSchema,
  type VerifyRecaptchaSuccessJson,
} from './recaptcha.schema'

const RecaptchaVerifyApiBodySchema = z.discriminatedUnion('success', [
  VerifyRecaptchaSuccessJsonSchema,
  VerifyRecaptchaErrorJsonSchema,
])

export type VerifyRecaptchaOnServerResult =
  | { ok: true; data: VerifyRecaptchaSuccessJson }
  | { ok: false; reason: 'network' }
  | { ok: false; reason: 'invalid_response'; status: number }
  | {
      ok: false
      reason: 'rejected'
      status: number
      error?: string
    }


export async function verifyRecaptchaOnServer(
  token: string,
): Promise<VerifyRecaptchaOnServerResult> {
  let res: Response
  try {
    res = await fetch(RECAPTCHA_VERIFY_API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
  } catch {
    return { ok: false, reason: 'network' }
  }

  let json: unknown
  try {
    json = await res.json()
  } catch {
    return { ok: false, reason: 'invalid_response', status: res.status }
  }

  const parsed = RecaptchaVerifyApiBodySchema.safeParse(json)
  if (!parsed.success) {
    return { ok: false, reason: 'invalid_response', status: res.status }
  }

  const body = parsed.data
  if (body.success) {
    return { ok: true, data: body }
  }

  return {
    ok: false,
    reason: 'rejected',
    status: res.status,
    error: body.error,
  }
}
