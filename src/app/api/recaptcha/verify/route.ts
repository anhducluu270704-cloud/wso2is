import { postRecaptchaVerify } from '@/services/recaptcha/recaptcha.verify'

export async function POST(request: Request) {
  return postRecaptchaVerify(request)
}
