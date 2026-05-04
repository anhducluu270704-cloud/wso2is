
import { RECAPTCHA_VERIFY_API_PATH } from '@/constants/recaptcha'

import { verifyRecaptchaOnServer } from '../recaptcha.client'

describe('services/recaptcha/recaptcha.client', () => {
  const fetchMock = jest.fn()

  beforeAll(() => {
    global.fetch = fetchMock as unknown as typeof fetch
  })

  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('ok: true khi API trả JSON success: true', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: async () => ({ success: true, score: 0.9 }),
    })

    const result = await verifyRecaptchaOnServer('tok')

    expect(fetchMock).toHaveBeenCalledWith(RECAPTCHA_VERIFY_API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'tok' }),
    })
    expect(result).toEqual({
      ok: true,
      data: { success: true, score: 0.9 },
    })
  })

  it('network: fetch throw', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    const result = await verifyRecaptchaOnServer('tok')
    expect(result).toEqual({ ok: false, reason: 'network' })
  })

  it('invalid_response: JSON không parse được', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: async () => {
        throw new Error('bad json')
      },
    })
    const result = await verifyRecaptchaOnServer('tok')
    expect(result).toEqual({ ok: false, reason: 'invalid_response', status: 200 })
  })

  it('invalid_response: body không khớp schema', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: async () => ({ foo: 1 }),
    })
    const result = await verifyRecaptchaOnServer('tok')
    expect(result).toEqual({ ok: false, reason: 'invalid_response', status: 200 })
  })

  it('rejected: success false và giữ error', async () => {
    fetchMock.mockResolvedValue({
      status: 400,
      json: async () => ({
        success: false,
        error: 'reCAPTCHA score too low',
      }),
    })
    const result = await verifyRecaptchaOnServer('tok')
    expect(result).toEqual({
      ok: false,
      reason: 'rejected',
      status: 400,
      error: 'reCAPTCHA score too low',
    })
  })
})
