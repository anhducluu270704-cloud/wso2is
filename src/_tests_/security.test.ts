import { isAuthRequest } from '@/constants/system'
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/constants/regex'
import { decodeJwtPayloadWithoutVerification } from '@/util'
import { getPasswordChecks, isPasswordValid } from '@/util/password-validation'
import { SignUpRequestSchema } from '@/services/auth/auth.schema'

describe('Bảo mật - tổng hợp', () => {
  describe('Token: không gửi Authorization lên URL auth', () => {
    it('isAuthRequest true cho /token', () => {
      expect(isAuthRequest('/auth/token')).toBe(true)
      expect(isAuthRequest('/token')).toBe(true)
    })
    it('isAuthRequest false cho API khác', () => {
      expect(isAuthRequest('/application/list')).toBe(false)
      expect(isAuthRequest('/internal/profile')).toBe(false)
    })
  })

  describe('Validation input: email, password', () => {
    it('EMAIL_REGEX từ chối XSS-like string', () => {
      expect(EMAIL_REGEX.test('<script>alert(1)</script>')).toBe(false)
      expect(EMAIL_REGEX.test('user@domain.com')).toBe(true)
    })
    it('PASSWORD_REGEX từ chối mật khẩu yếu', () => {
      expect(PASSWORD_REGEX.test('12345678')).toBe(false)
      expect(PASSWORD_REGEX.test('password')).toBe(false)
      expect(PASSWORD_REGEX.test('ValidPass1!')).toBe(true)
    })
  })

  describe('JWT: decode an toàn (không verify chữ ký)', () => {
    it('decodeJwtPayloadWithoutVerification trả về null cho input không decode được', () => {
      expect(decodeJwtPayloadWithoutVerification('')).toBeNull()
      expect(decodeJwtPayloadWithoutVerification('random')).toBeNull()
    })
  })

  describe('Mật khẩu: đủ độ mạnh', () => {
    it('getPasswordChecks + isPasswordValid đảm bảo đủ 5 điều kiện', () => {
      const weak = getPasswordChecks('weak')
      expect(isPasswordValid(weak)).toBe(false)
      const strong = getPasswordChecks('ValidPass1!')
      expect(isPasswordValid(strong)).toBe(true)
    })
  })

  describe('SignUp: confirmPassword phải khớp', () => {
    it('SignUpRequestSchema reject khi password !== confirmPassword', () => {
      const result = SignUpRequestSchema.safeParse({
        fullName: 'A',
        email: 'a@b.com',
        password: 'ValidPass1!',
        confirmPassword: 'OtherPass1!',
        companyName: 'Co',
        companyEmail: 'co@co.com',
        mobileNumber: '0901234567',
        taxNumber: '123',
        captcha: 'x',
        tncAccepted: true,
      })
      expect(result.success).toBe(false)
    })
  })
})
