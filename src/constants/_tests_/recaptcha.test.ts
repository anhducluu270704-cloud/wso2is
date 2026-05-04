import {
  RECAPTCHA_ERROR_DESCRIPTIONS,
  RECAPTCHA_SITEVERIFY_TRANSPORT_ERROR,
  RECAPTCHA_VERIFY_API_PATH,
  RECAPTCHA_VERIFY_URL,
} from '@/constants/recaptcha'

describe('constants/recaptcha', () => {
  it('RECAPTCHA_VERIFY_URL points to Google siteverify', () => {
    expect(RECAPTCHA_VERIFY_URL).toBe(
      'https://www.google.com/recaptcha/api/siteverify'
    )
  })

  it('RECAPTCHA_VERIFY_API_PATH is internal verify route', () => {
    expect(RECAPTCHA_VERIFY_API_PATH).toBe('/api/recaptcha/verify')
  })

  it('RECAPTCHA_ERROR_DESCRIPTIONS covers known Google error codes', () => {
    expect(RECAPTCHA_ERROR_DESCRIPTIONS['missing-input-secret']).toContain(
      'secret'
    )
    expect(RECAPTCHA_ERROR_DESCRIPTIONS['invalid-input-response']).toContain(
      'response'
    )
    expect(RECAPTCHA_ERROR_DESCRIPTIONS['timeout-or-duplicate']).toContain(
      'valid'
    )
  })

  it('RECAPTCHA_SITEVERIFY_TRANSPORT_ERROR describes network failures', () => {
    expect(RECAPTCHA_SITEVERIFY_TRANSPORT_ERROR).toContain('reCAPTCHA')
    expect(RECAPTCHA_SITEVERIFY_TRANSPORT_ERROR.length).toBeGreaterThan(20)
  })
})
