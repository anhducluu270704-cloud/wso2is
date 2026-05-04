import recaptchaApi from './recaptcha.service'
import {
  GoogleSiteVerifyResponseSchema,
  type GoogleSiteVerifyResponse,
  type VerifyRecaptchaErrorJson,
  type VerifyRecaptchaOutcome,
  type VerifyRecaptchaSuccessJson,
  RecaptchaVerifyRequestSchema,
} from './recaptcha.schema'

import {
  RECAPTCHA_ERROR_DESCRIPTIONS,
  RECAPTCHA_SITEVERIFY_TRANSPORT_ERROR,
} from '@/constants/recaptcha'

function getErrorDescriptions(codes: string[] | undefined): string[] {
  if (!codes?.length) return []
  return codes.map(
    (code) => RECAPTCHA_ERROR_DESCRIPTIONS[code] ?? `${code} (unknown)`
  )
}

function getRecaptchaMinScore(): number {
  return Number(process.env.NEXT_PUBLIC_RECAPTCHA_MIN_SCORE) || 0.5
}

export async function verifyRecaptchaToken(
  secret: string,
  token: string,
  minScore = getRecaptchaMinScore()
): Promise<VerifyRecaptchaOutcome> {
  let raw: unknown
  try {
    raw = await recaptchaApi.siteVerify({ secret, response: token })
  } catch {
    return {
      ok: false,
      status: 503,
      body: {
        success: false,
        error: RECAPTCHA_SITEVERIFY_TRANSPORT_ERROR,
      },
    }
  }

  const parsed = GoogleSiteVerifyResponseSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      status: 502,
      body: {
        success: false,
        error: 'Invalid response from reCAPTCHA service',
      },
    }
  }

  const data: GoogleSiteVerifyResponse = parsed.data

  if (!data.success) {
    const errorCodes = data['error-codes'] ?? []
    const errorDescriptions = getErrorDescriptions(errorCodes)
    const body: VerifyRecaptchaErrorJson = {
      success: false,
      errorCodes,
      errorDescriptions,
      error:
        errorDescriptions.length > 0
          ? errorDescriptions.join(' ')
          : 'reCAPTCHA verification failed',
    }
    return {
      ok: false,
      status: 400,
      body,
    }
  }

  const score = data.score ?? 0
  if (score < minScore) {
    const body: VerifyRecaptchaErrorJson = {
      success: false,
      score,
      error: 'reCAPTCHA score too low',
      minScore,
    }
    return {
      ok: false,
      status: 400,
      body,
    }
  }

  const body: VerifyRecaptchaSuccessJson = {
    success: true,
    score: data.score,
    action: data.action,
    challenge_ts: data.challenge_ts,
    hostname: data.hostname,
  }
  return {
    ok: true,
    body,
  }
}

/** POST /api/recaptcha/verify */
export async function postRecaptchaVerify(request: Request): Promise<Response> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) {
    return Response.json(
      { success: false, error: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return Response.json(
      { success: false, error: 'Invalid JSON' },
      { status: 400 }
    )
  }

  const parsed = RecaptchaVerifyRequestSchema.safeParse(json)
  if (!parsed.success) {
    return Response.json(
      { success: false, error: 'Missing token' },
      { status: 400 }
    )
  }

  const outcome = await verifyRecaptchaToken(secret, parsed.data.token)
  if (!outcome.ok) {
    return Response.json(outcome.body, { status: outcome.status })
  }

  return Response.json(outcome.body)
}
