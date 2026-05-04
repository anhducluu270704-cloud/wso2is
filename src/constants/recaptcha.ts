export const RECAPTCHA_VERIFY_URL =
  'https://www.google.com/recaptcha/api/siteverify'

export const RECAPTCHA_VERIFY_API_PATH = '/api/recaptcha/verify'

export const RECAPTCHA_ERROR_DESCRIPTIONS: Record<string, string> = {
  'missing-input-secret': 'The secret parameter is missing.',
  'invalid-input-secret': 'The secret parameter is invalid or malformed.',
  'missing-input-response': 'The response parameter is missing.',
  'invalid-input-response': 'The response parameter is invalid or malformed.',
  'bad-request': 'The request is invalid or malformed.',
  'timeout-or-duplicate':
    'The response is no longer valid: either is too old or has been used previously.',
}

export const RECAPTCHA_SITEVERIFY_TRANSPORT_ERROR =
  'Cannot reach Google reCAPTCHA (network timeout or blocked). Check firewall, VPN, or internet access.'