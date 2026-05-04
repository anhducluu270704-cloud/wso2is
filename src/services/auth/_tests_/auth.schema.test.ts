
/**
 * Unit test: services/auth - schema validation (bảo mật input)
 */
import {
  GetUrlLoginResponseSchema,
  SignUpRequestSchema,
  GetTokenRequestSchema,
  AuthInfoBaseSchema,
  AuthInfoBaseResponseSchema,
  RefreshTokenRequestSchema,
  LogoutRequestSchema,
  UserTokenDecodeSchema,
  AuthInfoFullSchema,
} from '../auth.schema'
import { MOCK_ACCESS_TOKEN, MOCK_AUTH_INFO_BASE } from '@/_tests_/mocks'

describe('services/auth/auth.schema - bảo mật validation', () => {
  describe('GetUrlLoginResponseSchema', () => {
    it('parse login url response', () => {
      expect(
        GetUrlLoginResponseSchema.safeParse({
          message: 'OK',
          code: '200',
          data: 'https://example.com/login',
        }).success
      ).toBe(true)
    })
  })

  describe('SignUpRequestSchema', () => {
    const validSignUpBody = {
      full_name: 'Nguyen Van A',
      password: 'ValidPass1!',
      account_type: 'BUSINESS_OWNER' as const,
      company_name: 'Company',
      company_email: 'co@company.com',
      business_type: 'FINANCE',
      phone_number: '09012345678',
      tax_code: '0123456789',
      recaptchaToken: 'recaptcha-jwt-from-client',
    }

    it('chấp nhận payload API đăng ký (snake_case, có recaptchaToken, không confirm/tnc)', () => {
      const result = SignUpRequestSchema.safeParse(validSignUpBody)
      expect(result.success).toBe(true)
    })

    it('từ chối khi thiếu recaptchaToken hoặc token rỗng', () => {
      const { recaptchaToken: _r, ...withoutToken } = validSignUpBody
      expect(SignUpRequestSchema.safeParse(withoutToken).success).toBe(false)
      expect(
        SignUpRequestSchema.safeParse({
          ...validSignUpBody,
          recaptchaToken: '',
        }).success
      ).toBe(false)
    })

    it('từ chối khi thiếu field bắt buộc hoặc format sai', () => {
      expect(
        SignUpRequestSchema.safeParse({
          ...validSignUpBody,
          company_email: 'not-an-email',
        }).success
      ).toBe(false)
      expect(
        SignUpRequestSchema.safeParse({
          ...validSignUpBody,
          tax_code: '123',
        }).success
      ).toBe(false)
    })

    it('full_name: regex 3–50 ký tự áp dụng sau khi trim khoảng trắng đầu cuối', () => {
      expect(
        SignUpRequestSchema.safeParse({
          ...validSignUpBody,
          full_name: '  Nguyen Van A  ',
        }).success,
      ).toBe(true)

      expect(
        SignUpRequestSchema.safeParse({
          ...validSignUpBody,
          full_name: '  ab  ',
        }).success,
      ).toBe(false)
    })

    it('email, phone, tax, company_name, password: regex kiểm tra sau trim hai đầu', () => {
      expect(
        SignUpRequestSchema.safeParse({
          ...validSignUpBody,
          company_email: '  co@company.com  ',
          phone_number: '  09012345678  ',
          tax_code: '  0123456789  ',
          company_name: '  Company  ',
          password: '  ValidPass1!  ',
        }).success,
      ).toBe(true)
    })
  })

  describe('GetTokenRequestSchema', () => {
    it('cần code và redirect_uri', () => {
      expect(GetTokenRequestSchema.safeParse({ code: 'c', redirect_uri: 'https://a.com' }).success).toBe(true)
      expect(GetTokenRequestSchema.safeParse({ code: 'c' }).success).toBe(false)
    })
  })

  describe('AuthInfoBaseSchema', () => {
    it('parse auth response từ server', () => {
      const result = AuthInfoBaseSchema.safeParse(MOCK_AUTH_INFO_BASE)
      expect(result.success).toBe(true)
    })
  })

  describe('AuthInfoBaseResponseSchema', () => {
    it('parse auth base response wrapper', () => {
      expect(
        AuthInfoBaseResponseSchema.safeParse({
          message: 'OK',
          code: '200',
          data: MOCK_AUTH_INFO_BASE,
        }).success
      ).toBe(true)
    })
  })

  describe('RefreshTokenRequestSchema', () => {
    it('requires refreshToken', () => {
      expect(
        RefreshTokenRequestSchema.safeParse({ refreshToken: 'token' }).success
      ).toBe(true)
      expect(RefreshTokenRequestSchema.safeParse({}).success).toBe(false)
    })
  })

  describe('LogoutRequestSchema', () => {
    it('requires idToken and callback', () => {
      expect(
        LogoutRequestSchema.safeParse({
          idToken: 'id-token',
          callback: 'https://app.example.com',
        }).success
      ).toBe(true)
      expect(LogoutRequestSchema.safeParse({ idToken: 'id-token' }).success).toBe(false)
    })
  })

  describe('UserTokenDecodeSchema', () => {
    it('parses decoded token payload', () => {
      expect(
        UserTokenDecodeSchema.safeParse({
          sub: 'user123',
          aut: 'application',
          iss: 'http://test.com',
          client_id: 'cli',
          aud: 'aud',
          nbf: 1600000000,
          azp: 'azp',
          org_id: 'org1',
          exp: 1900000000,
          org_name: 'Test Org',
          iat: 1600000000,
          jti: 'jti1',
          org_handle: 'test',
        }).success
      ).toBe(true)
    })
  })

  describe('AuthInfoFullSchema', () => {
    it('transforms auth info and injects decoded user plus refresh_at', () => {
      const result = AuthInfoFullSchema.parse({
        ...MOCK_AUTH_INFO_BASE,
        access_token: MOCK_ACCESS_TOKEN,
      })

      expect(result.user.sub).toBe('user123')
      expect(result.user.org_name).toBe('Test Org')
      expect(result.refresh_at).toBeGreaterThan(Date.now())
    })
  })
})
