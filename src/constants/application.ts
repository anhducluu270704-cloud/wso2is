export const APPLICATION_STATUS = [
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'APPROVED',
] as const

export const APPLICATION_TIER = ['SANDBOX', 'PRODUCTION'] as const

export const APPLICATION_NAME_MIN_LENGTH = 3
export const APPLICATION_NAME_MAX_LENGTH = 50
export const APPLICATION_DESCRIPTION_MAX_LENGTH = 512

export const APPLICATION_LIST_PAGE_SIZE = 3

export const APPLICATION_LIST_INITIAL_PAGE_SIZE = 6

export const FALLBACK_TOAST_DURATION_MS = 5000
export const TOAST_EXIT_ANIMATION_MS = 300

export const DEFAULT_GRANT_TYPES = ['password', 'client_credentials']
