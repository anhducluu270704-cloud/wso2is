
/**
 * Unit test: util/password-validation - bảo mật mật khẩu
 */
import {
  getPasswordChecks,
  isPasswordValid,
  getChangePasswordValidation,
  type PasswordChecks,
  type ChangePasswordFormData,
} from '@/util/password-validation'

describe('util/password-validation', () => {
  describe('getPasswordChecks', () => {
    it('đạt tất cả điều kiện với mật khẩu mạnh', () => {
      const checks = getPasswordChecks('ValidPass1!')
      expect(checks.length).toBe(true)
      expect(checks.upper).toBe(true)
      expect(checks.lower).toBe(true)
      expect(checks.digit).toBe(true)
      expect(checks.special).toBe(true)
    })

    it('thiếu chữ hoa', () => {
      const checks = getPasswordChecks('validpass1!')
      expect(checks.upper).toBe(false)
    })

    it('thiếu chữ thường', () => {
      const checks = getPasswordChecks('VALIDPASS1!')
      expect(checks.lower).toBe(false)
    })

    it('thiếu số', () => {
      const checks = getPasswordChecks('ValidPass!')
      expect(checks.digit).toBe(false)
    })

    it('thiếu ký tự đặc biệt', () => {
      const checks = getPasswordChecks('ValidPass1')
      expect(checks.special).toBe(false)
    })

    it('quá ngắn (< 8)', () => {
      const checks = getPasswordChecks('Val1!')
      expect(checks.length).toBe(false)
    })

    it('quá dài (> 20)', () => {
      const long = 'ValidPass1!' + 'a'.repeat(10)
      const checks = getPasswordChecks(long)
      expect(checks.length).toBe(false)
    })
  })

  describe('isPasswordValid', () => {
    it('true khi tất cả check đạt', () => {
      const checks: PasswordChecks = {
        length: true,
        upper: true,
        lower: true,
        digit: true,
        special: true,
      }
      expect(isPasswordValid(checks)).toBe(true)
    })

    it('false khi thiếu một điều kiện', () => {
      expect(
        isPasswordValid({
          length: true,
          upper: false,
          lower: true,
          digit: true,
          special: true,
        }),
      ).toBe(false)
    })
  })

  describe('getChangePasswordValidation - bảo mật đổi mật khẩu', () => {
    it('canSubmit true khi current có giá trị, new hợp lệ, confirm khớp', () => {
      const formData: ChangePasswordFormData = {
        currentPassword: 'any-current',
        newPassword: 'NewPass1!',
        confirmPassword: 'NewPass1!',
      }
      const result = getChangePasswordValidation(formData)
      expect(result.isNewPasswordValid).toBe(true)
      expect(result.isConfirmPasswordMismatch).toBe(false)
      expect(result.canSubmit).toBe(true)
    })

    it('canSubmit false khi current rỗng', () => {
      const formData: ChangePasswordFormData = {
        currentPassword: '',
        newPassword: 'NewPass1!',
        confirmPassword: 'NewPass1!',
      }
      const result = getChangePasswordValidation(formData)
      expect(result.canSubmit).toBe(false)
    })

    it('isConfirmPasswordMismatch khi confirm không khớp new', () => {
      const formData: ChangePasswordFormData = {
        currentPassword: 'any-current',
        newPassword: 'NewPass1!',
        confirmPassword: 'OtherPass1!',
      }
      const result = getChangePasswordValidation(formData)
      expect(result.isConfirmPasswordMismatch).toBe(true)
      expect(result.canSubmit).toBe(false)
    })
  })
})
