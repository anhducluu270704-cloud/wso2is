import { LOCALES_DEFAULT, LOCALES_LIST } from '@/constants/locales'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES_LIST,

  // Used when no locale matches
  defaultLocale: LOCALES_DEFAULT,
  localeDetection: false,
  localePrefix: 'always',
})
