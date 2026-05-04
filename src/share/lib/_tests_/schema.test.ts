import { validateEmailSchema, validatePhoneSchema } from '../schema'

describe('share/lib/schema', () => {
  describe('validateEmailSchema', () => {
    const EmailSchema = validateEmailSchema()

    it('accepts valid email and trims leading/trailing spaces', () => {
      const result = EmailSchema.safeParse('  dev@company.com  ')
      expect(result.success).toBe(true)
      expect(result.data).toBe('dev@company.com')
    })

    it('rejects invalid email format', () => {
      expect(EmailSchema.safeParse('not-an-email').success).toBe(false)
    })
  })

  describe('validatePhoneSchema', () => {
    const PhoneSchema = validatePhoneSchema()

    it('accepts valid phone and trims leading/trailing spaces', () => {
      const result = PhoneSchema.safeParse('  09012345678  ')
      expect(result.success).toBe(true)
      expect(result.data).toBe('09012345678')
    })

    it('rejects non-digit characters', () => {
      expect(PhoneSchema.safeParse('09A123').success).toBe(false)
    })
  })
})
