import { LOCALE_SELECTED_KEY } from '@/constants/system'
import authApi from '@/services/auth/auth.service'

export function buildLoginUrlWithUiLang(loginUrlFromApi: string): string {
  const targetUrl = new URL(loginUrlFromApi, window.location.origin)
  targetUrl.searchParams.set(
    'ui_locales',
    localStorage.getItem(LOCALE_SELECTED_KEY) ?? 'vi_VN'
  )
  return targetUrl.toString()
}

export async function fetchLoginPageUrl(locale: string): Promise<string> {
  const res = await authApi.signIn(
    `${window.location.origin}/${locale}/get-token`
  )
  return buildLoginUrlWithUiLang(res.data)
}
