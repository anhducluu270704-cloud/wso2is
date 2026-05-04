export {}

declare global {
  interface Window {
    __ENV__?: {
      NEXT_PUBLIC_ENVIRONMENT?: string
      NEXT_PUBLIC_BACK_END_DOMAIN?: string
      NEXT_PUBLIC_TIME_OUT_API?: string
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY?: string
    }
  }
}