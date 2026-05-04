
const siteVerify = jest.fn()

jest.mock('../recaptcha.service', () => ({
  __esModule: true,
  default: {
    siteVerify: (...a: unknown[]) => siteVerify(...a),
  },
}))

import {
  postRecaptchaVerify,
  verifyRecaptchaToken,
} from '../recaptcha.verify'

/** jsdom thường không có Response.json — chỉ file test này cần khi gọi postRecaptchaVerify */
;(function ensureResponsePolyfill() {
  const R = globalThis.Response as typeof Response | undefined
  if (R && typeof R.json === 'function') return

  globalThis.Response = class ResponsePolyfill {
    _raw?: string
    status: number
    _jsonData?: unknown

    constructor(body?: string, init: { status?: number } = {}) {
      this._raw = body
      this.status = init.status ?? 200
    }

    static json(data: unknown, init: { status?: number } = {}) {
      const r = new ResponsePolyfill(JSON.stringify(data), {
        status: init.status ?? 200,
      })
      r._jsonData = data
      return r as unknown as Response
    }

    async json() {
      if (this._jsonData !== undefined) return this._jsonData
      if (typeof this._raw === 'string') return JSON.parse(this._raw)
      return this._raw
    }
  } as unknown as typeof Response
})()

function mockJsonRequest(json: unknown): Request {
  return {
    json: async () => json,
  } as Request
}

function mockTextRequest(body: string): Request {
  return {
    json: async () => {
      JSON.parse(body)
      return {}
    },
  } as Request
}

describe('services/recaptcha/recaptcha.verify', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...OLD_ENV,
      RECAPTCHA_SECRET_KEY: 'test-secret',
    }
    siteVerify.mockReset()
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  describe('verifyRecaptchaToken', () => {
    it('503 khi siteVerify throw (axios/mạng)', async () => {
      siteVerify.mockRejectedValue(new Error('timeout'))
      const out = await verifyRecaptchaToken('sec', 'tok')
      expect(out.ok).toBe(false)
      if (!out.ok) {
        expect(out.status).toBe(503)
        expect(out.body.error).toContain('Cannot reach Google')
      }
    })

    it('502 khi JSON Google không khớp schema', async () => {
      siteVerify.mockResolvedValue({ not: 'valid' })
      const out = await verifyRecaptchaToken('sec', 'tok')
      expect(out.ok).toBe(false)
      if (!out.ok) expect(out.status).toBe(502)
    })

    it('400 khi Google trả success: false', async () => {
      siteVerify.mockResolvedValue({
        success: false,
        'error-codes': ['invalid-input-response'],
      })
      const out = await verifyRecaptchaToken('sec', 'tok')
      expect(out.ok).toBe(false)
      if (!out.ok) {
        expect(out.status).toBe(400)
        expect(out.body.errorCodes).toEqual(['invalid-input-response'])
      }
    })

    it('400 khi score thấp hơn RECAPTCHA_MIN_SCORE', async () => {
      process.env.RECAPTCHA_MIN_SCORE = '0.9'
      siteVerify.mockResolvedValue({ success: true, score: 0.1 })
      const out = await verifyRecaptchaToken('sec', 'tok')
      expect(out.ok).toBe(false)
      if (!out.ok) {
        expect(out.status).toBe(400)
        expect(out.body.error).toBe('reCAPTCHA score too low')
      }
    })

    it('ok khi success và score đủ', async () => {
      process.env.RECAPTCHA_MIN_SCORE = '0.5'
      siteVerify.mockResolvedValue({
        success: true,
        score: 0.9,
        action: 'signup',
      })
      const out = await verifyRecaptchaToken('sec', 'tok')
      expect(out.ok).toBe(true)
      if (out.ok) {
        expect(out.body.success).toBe(true)
        expect(out.body.score).toBe(0.9)
      }
      expect(siteVerify).toHaveBeenCalledWith({
        secret: 'sec',
        response: 'tok',
      })
    })

    it('400 khi success true nhưng thiếu score (coi như 0)', async () => {
      process.env.RECAPTCHA_MIN_SCORE = '0.5'
      siteVerify.mockResolvedValue({ success: true })
      const out = await verifyRecaptchaToken('sec', 'tok')
      expect(out.ok).toBe(false)
      if (!out.ok) {
        expect(out.status).toBe(400)
        expect(out.body.error).toBe('reCAPTCHA score too low')
      }
    })

    it('map error-codes không xác định sang mô tả unknown', async () => {
      siteVerify.mockResolvedValue({
        success: false,
        'error-codes': ['some-made-up-code'],
      })
      const out = await verifyRecaptchaToken('sec', 'tok')
      expect(out.ok).toBe(false)
      if (!out.ok && 'errorDescriptions' in out.body) {
        expect(out.body.errorDescriptions?.[0]).toContain('unknown')
      }
    })
  })

  describe('postRecaptchaVerify', () => {
    it('503 khi thiếu RECAPTCHA_SECRET_KEY (không lộ chi tiết cấu hình)', async () => {
      delete process.env.RECAPTCHA_SECRET_KEY
      const res = await postRecaptchaVerify(mockJsonRequest({ token: 't' }))
      expect(res.status).toBe(503)
      const j = await res.json()
      expect(j.success).toBe(false)
      expect(j.error).toBe('Service temporarily unavailable')
    })

    it('400 khi body JSON không hợp lệ', async () => {
      const res = await postRecaptchaVerify(mockTextRequest('not-json'))
      expect(res.status).toBe(400)
    })

    it('400 khi thiếu token', async () => {
      const res = await postRecaptchaVerify(mockJsonRequest({}))
      expect(res.status).toBe(400)
    })

    it('200 khi verify thành công', async () => {
      siteVerify.mockResolvedValue({ success: true, score: 0.9 })
      const res = await postRecaptchaVerify(
        mockJsonRequest({ token: ' good ' }),
      )
      expect(res.status).toBe(200)
      const j = await res.json()
      expect(j.success).toBe(true)
      expect(j.score).toBe(0.9)
    })
  })
})
