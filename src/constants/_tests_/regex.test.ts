
/**
 * Unit test: constants/regex - validation email, password
 */
import { EMAIL_FORMAT_REGEX, EMAIL_REGEX, PASSWORD_REGEX } from '@/constants/regex'

describe('constants/regex - bảo mật validation', () => {
  describe('EMAIL_FORMAT_REGEX', () => {
    it('chấp nhận định dạng hợp lệ (độ dài xử lý ở schema)', () => {
      expect(EMAIL_FORMAT_REGEX.test('user@example.com')).toBe(true)
    })
    it('từ chối chuỗi không phải email', () => {
      expect(EMAIL_FORMAT_REGEX.test('invalid')).toBe(false)
    })
  })

  describe('EMAIL_REGEX', () => {
    it('chấp nhận email hợp lệ', () => {
      expect(EMAIL_REGEX.test('user@example.com')).toBe(true)
      // EMAIL_REGEX: local part chỉ [A-Za-z0-9._-], không gồm '+'
      expect(EMAIL_REGEX.test('user.name-tag@company.co.uk')).toBe(true)
    })
    it('từ chối email không hợp lệ', () => {
      expect(EMAIL_REGEX.test('invalid')).toBe(false)
      expect(EMAIL_REGEX.test('@nodomain.com')).toBe(false)
      expect(EMAIL_REGEX.test('user@')).toBe(false)
    })
  })

  describe('PASSWORD_REGEX', () => {
    it('chấp nhận mật khẩu đủ mạnh (8-20, upper, lower, digit, special)', () => {
      expect(PASSWORD_REGEX.test('ValidPass1!')).toBe(true)
    })
    it('từ chối mật khẩu có khoảng trắng', () => {
      expect(PASSWORD_REGEX.test('Valid Pass1!')).toBe(false)
    })
    it('từ chối mật khẩu quá ngắn', () => {
      expect(PASSWORD_REGEX.test('Val1!')).toBe(false)
    })
  })
})
