'use client'

import { ACCEPT_LANGUAGE_DEFAULT, LOCALES_LIST_PLUS } from '@/constants/locales'
import { LOCALE_SELECTED_KEY } from '@/constants/system'
import { useEffect } from 'react'

export default function LocaleWatcher(
  props: Readonly<{ locale: string }>,
) {
  const { locale } = props
  useEffect(() => {
    if (locale) {
      const lang =
        LOCALES_LIST_PLUS.find((e) => e.key === locale)?.acceptLang ??
        ACCEPT_LANGUAGE_DEFAULT

      localStorage.setItem(LOCALE_SELECTED_KEY, lang)
    }
  }, [locale])

  return null
}
