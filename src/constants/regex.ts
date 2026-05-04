export const INPUT_EMPTY_REGEX = /^\s*$/

export const FULL_NAME_REGEX = /^(?!\s*$).{3,50}$/u

export const COMPANY_NAME_REGEX = /^[\p{L}\p{M}\p{N} ]+$/u

export const EMAIL_FORMAT_REGEX =
  /^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9._-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/

export const EMAIL_REGEX =
  /^(?=.{5,35}$)(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9._-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/

export const COMPANY_EMAIL_MIN_LENGTH = 5
export const COMPANY_EMAIL_MAX_LENGTH = 35

export const PASSWORD_REGEX =
  /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/

export const MOBILE_NUMBER_REGEX = /^0\d{9,10}$/

export const MOBILE_NUMBER_MIN_LENGTH = 10
export const MOBILE_NUMBER_MAX_LENGTH = 11

export const MOBILE_NUMBER_DIGITS_ONLY_REGEX = /^\d+$/

export const TAX_NUMBER_REGEX = /^\d{10,13}$/

export const HTTP_REFERER_PATTERN =
  /^(?=.*[a-zA-Z])(\*\.|[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+(\/[^\s]*)?$/

export const IPV4_WITH_OPTIONAL_CIDR = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/

export const IPV6_WITH_OPTIONAL_CIDR = /^[0-9a-fA-F:]+(\/\d{1,3})?$/

export const APPLICATION_NAME_REGEX = /^[\p{L}\p{N} ]+$/u

export const COMPANY_ADDRESS_REGEX = /^[\p{L}\p{M}\p{N},./\- ]+$/u

export const LEADING_UUID_FILENAME =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}-/