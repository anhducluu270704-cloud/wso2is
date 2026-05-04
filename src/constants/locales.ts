export const LOCALES_LIST_PLUS = [
  { key: 'vi', name: 'Tiếng Việt', acceptLang: 'vi_VN', isDefault: true },
  { key: 'en', name: 'English', acceptLang: 'en_US' },
]
export const LOCALES_LIST = LOCALES_LIST_PLUS.map((l) => l.key)
export const LOCALES_DEFAULT_PLUS =
  LOCALES_LIST_PLUS.find((l) => l.isDefault) ?? LOCALES_LIST_PLUS[0]
//Ngôn ngữ mặc định
export const LOCALES_DEFAULT = LOCALES_DEFAULT_PLUS.key
export const ACCEPT_LANGUAGE_DEFAULT: string = LOCALES_DEFAULT_PLUS.acceptLang

export const LOCALES_MAP: Record<string, string> = Object.fromEntries(
  LOCALES_LIST_PLUS.map((l) => [l.key, l.acceptLang])
) as Record<string, string>

export const LOCALES_NAME_MAP: Record<string, string> = Object.fromEntries(
  LOCALES_LIST_PLUS.map((l) => [l.key, l.name])
) as Record<string, string>