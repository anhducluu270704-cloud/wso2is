export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 20
export const PASSWORD_SPECIAL_REGEX =
  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/

/** Keys aligned with `PasswordChecks` in `@/util/password-validation`; labels live in `signup.rules.*` i18n. */
export const PASSWORD_REQUIREMENT_KEYS = [
  'length',
  'upper',
  'lower',
  'digit',
  'special',
] as const

export type PasswordRequirementKey = (typeof PASSWORD_REQUIREMENT_KEYS)[number]
