import { RECAPTCHA_VERIFY_URL } from '@/constants/recaptcha'
import axios, { AxiosResponse } from 'axios'

import type {
  GoogleSiteVerifyResponse,
  RecaptchaSiteVerifyForm,
} from './recaptcha.schema'

const recaptchaVerify = axios.create({
  baseURL: process.env.RECAPTCHA_VERIFY_URL ?? RECAPTCHA_VERIFY_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: !isNaN(Number(process.env.RECAPTCHA_VERIFY_TIMEOUT_MS))
    ? Number(process.env.RECAPTCHA_VERIFY_TIMEOUT_MS)
    : 30_000,
})

recaptchaVerify.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: unknown) =>
    Promise.reject(error instanceof Error ? error : new Error(String(error))),
)

const recaptchaApi = {
  siteVerify(
    body: RecaptchaSiteVerifyForm,
  ): Promise<GoogleSiteVerifyResponse> {
    return recaptchaVerify.post(
      '',
      new URLSearchParams(body),
    )
  },
}

export default recaptchaApi
