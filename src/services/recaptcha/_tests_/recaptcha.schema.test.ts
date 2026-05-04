
import {
  GoogleSiteVerifyResponseSchema,
  RecaptchaSiteVerifyFormSchema,
  RecaptchaVerifyRequestSchema,
  VerifyRecaptchaErrorJsonSchema,
  VerifyRecaptchaSuccessJsonSchema,
} from '../recaptcha.schema'

describe('services/recaptcha/recaptcha.schema', () => {
  describe('GoogleSiteVerifyResponseSchema', () => {
    it('chấp nhận payload Google siteverify tối thiểu', () => {
      expect(
        GoogleSiteVerifyResponseSchema.safeParse({ success: true }).success,
      ).toBe(true)
    })
    it('từ chối khi thiếu success', () => {
      expect(GoogleSiteVerifyResponseSchema.safeParse({}).success).toBe(false)
    })
  })

  describe('RecaptchaSiteVerifyFormSchema', () => {
    it('cần secret và response không rỗng', () => {
      expect(
        RecaptchaSiteVerifyFormSchema.safeParse({
          secret: 's',
          response: 't',
        }).success,
      ).toBe(true)
      expect(
        RecaptchaSiteVerifyFormSchema.safeParse({
          secret: '',
          response: 't',
        }).success,
      ).toBe(false)
    })
  })

  describe('RecaptchaVerifyRequestSchema', () => {
    it('cần token không rỗng', () => {
      expect(
        RecaptchaVerifyRequestSchema.safeParse({ token: 'abc' }).success,
      ).toBe(true)
      expect(RecaptchaVerifyRequestSchema.safeParse({ token: '' }).success).toBe(
        false,
      )
    })
  })

  describe('VerifyRecaptchaSuccessJsonSchema / VerifyRecaptchaErrorJsonSchema', () => {
    it('phân nhánh success: true', () => {
      const r = VerifyRecaptchaSuccessJsonSchema.safeParse({
        success: true,
        score: 0.9,
      })
      expect(r.success).toBe(true)
    })
    it('phân nhánh success: false', () => {
      const r = VerifyRecaptchaErrorJsonSchema.safeParse({
        success: false,
        error: 'fail',
      })
      expect(r.success).toBe(true)
    })
  })
})
