import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_SPECIAL_REGEX
} from '@/constants/password'

export type PasswordChecks = {
  length: boolean
  upper: boolean
  lower: boolean
  digit: boolean
  special: boolean
}

export function getPasswordChecks(value: string): PasswordChecks {
  return {
    length: value.length >= PASSWORD_MIN_LENGTH && value.length <= PASSWORD_MAX_LENGTH,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    digit: /\d/.test(value),
    special: PASSWORD_SPECIAL_REGEX.test(value),
  }
}

export function isPasswordValid(checks: PasswordChecks): boolean {
  return (
    checks.length && checks.upper && checks.lower && checks.digit && checks.special
  )
}

export type ChangePasswordFormData = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type ChangePasswordValidation = {
  newPasswordChecks: PasswordChecks
  isNewPasswordValid: boolean
  isConfirmPasswordMismatch: boolean
  canSubmit: boolean
}

export function getChangePasswordValidation(
  formData: ChangePasswordFormData
): ChangePasswordValidation {
  const hasCurrentPassword = formData.currentPassword.length > 0

  const newPasswordChecks = getPasswordChecks(formData.newPassword)
  const isNewPasswordValid = isPasswordValid(newPasswordChecks)

  const isConfirmPasswordMismatch =
    formData.confirmPassword.length > 0 &&
    formData.confirmPassword !== formData.newPassword

  const canSubmit =
    hasCurrentPassword &&
    isNewPasswordValid &&
    formData.confirmPassword.length > 0 &&
    !isConfirmPasswordMismatch

  return {
    newPasswordChecks,
    isNewPasswordValid,
    isConfirmPasswordMismatch,
    canSubmit,
  }
}
