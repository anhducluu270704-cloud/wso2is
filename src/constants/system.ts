export const APP_NAME = 'TECHCOMBANK_OPEN_API' //Thay đổi app_name tương ứng với dự án
export const LOGO_REDIRECT = '/images/logo/Techcombank_logo.svg'
export const LOGO_REDIRECT_WHITE = '/images/logo/Techcombank_logo_footer.svg'
export const FACEBOOK_ICON = '/images/logo/FACEBOOK_ICON.svg'
export const YOUTUBE_ICON = '/images/logo/YOUTUBE_ICON.svg'
export const ZALO_ICON = '/images/logo/ZALO_ICON.svg'
export const LINKEDIN_ICON = '/images/logo/LINKEDIN_ICON.svg'

//Theme selected
export const THEME_KEY = `next_${APP_NAME}_theme`

//Locale selected
export const LOCALE_SELECTED_KEY = `next_${APP_NAME}_locale_selected`

//Auth info
export const TOKEN_KEY = `next_${APP_NAME}_access_token`
export const AUTH_INFO_KEY = `next_${APP_NAME}_auth_info`
export const REFRESH_TOKEN_KEY = `next_${APP_NAME}_refresh_token`

//BroadcastChannel
export const AUTH_BROADCAST_CHANNEL = `next_${APP_NAME}_auth_broadcast_channel`
export const AUTH_CURRENT_PAGE_KEY = `next_${APP_NAME}_auth_current_page`
export const LOCALES_CHANNEL = `next_${APP_NAME}_locales_channel`

//Auth request patterns - các URL patterns không cần Authorization header và không trigger refresh token
export const AUTH_REQUEST_PATTERNS = ['/token'] as const

//Helper function để check xem URL có phải auth request không
export const isAuthRequest = (url: string | undefined): boolean => {
  if (!url) return false
  return AUTH_REQUEST_PATTERNS.some((pattern) => url.includes(pattern))
}

/** POST /auth/refresh — dùng để không retry refresh lồng nhau khi 401 */
export const isAuthRefreshRequest = (url: string | undefined): boolean => {
  if (!url) return false
  return url.includes('/auth/refresh')
}

export const AUTH_REFRESH_FAILED_EVENT = 'auth:refresh-failed' as const

//environment
type Environment = 'local' | 'develop' | 'uat' | 'staging' | 'production'
const environment =
  (process.env.NEXT_PUBLIC_ENVIRONMENT as Environment) ?? 'production'

export const isLocal = () => environment === 'local'
export const isDev = () => environment === 'develop' || environment === 'local'
export const isUAT = () => environment === 'uat'
export const isStaging = () => environment === 'staging'
export const isProd = () => environment === 'production'

//Filter
export const ENUM_DIR_SORT = ['asc', 'desc'] as const
export const ENUM_TYPE_QUERY = ['eq', 'ne', 'like'] as const
export type TypeFilterQuery = (typeof ENUM_TYPE_QUERY)[number]
export const DEFAULT_PAGE_SIZE = 5
export const DEFAULT_PAGE_START = 1

//DATETIME FORMAT
export const DATE_TIME_FORMAT = 'DD/MM/YYYY h:mm:ss [AM]'
export const DATE_FORMAT = 'DD/MM/YYYY'
export const DATE_SHORT_FORMAT = 'DD/MM'
export const DATE_FORMAT_PARAM = 'YYYY-MM-DD'

//ERROR CODE
export const ERROR_CODES = {
  EXPIRED_AUTH_TOKEN: 'EXPIRED_AUTH_TOKEN',
  INVALID_AUTH_TOKEN: 'INVALID_AUTH_TOKEN',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
} as const