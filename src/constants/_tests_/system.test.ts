
/**
 * Unit test: constants/system - bảo mật: isAuthRequest
 */
import { isAuthRequest, AUTH_REQUEST_PATTERNS } from '@/constants/system'

describe('constants/system - bảo mật', () => {
  describe('isAuthRequest', () => {
    it('trả về true cho URL chứa /token', () => {
      expect(isAuthRequest('/token')).toBe(true)
      expect(isAuthRequest('/api/v1/token')).toBe(true)
      expect(isAuthRequest('https://api.example.com/token')).toBe(true)
    })

    it('trả về false cho URL không phải auth', () => {
      expect(isAuthRequest('/application/list')).toBe(false)
      expect(isAuthRequest('/profile')).toBe(false)
      expect(isAuthRequest(undefined)).toBe(false)
    })
  })

  describe('AUTH_REQUEST_PATTERNS', () => {
    it('chứa pattern /token', () => {
      expect(AUTH_REQUEST_PATTERNS).toContain('/token')
    })
  })

  describe('environment helpers', () => {
    const originalEnv = process.env.NEXT_PUBLIC_ENVIRONMENT

    afterEach(() => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = originalEnv
      jest.resetModules()
    })

    it('nhận diện từng environment khác nhau', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'develop' as any
      jest.resetModules()
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const dev = require('@/constants/system') as typeof import('@/constants/system')
      expect(dev.isDev()).toBe(true)
      expect(dev.isLocal()).toBe(false)

      process.env.NEXT_PUBLIC_ENVIRONMENT = 'uat' as any
      jest.resetModules()
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const uat = require('@/constants/system') as typeof import('@/constants/system')
      expect(uat.isUAT()).toBe(true)

      process.env.NEXT_PUBLIC_ENVIRONMENT = 'staging' as any
      jest.resetModules()
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const staging = require('@/constants/system') as typeof import('@/constants/system')
      expect(staging.isStaging()).toBe(true)

      process.env.NEXT_PUBLIC_ENVIRONMENT = 'production' as any
      jest.resetModules()
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const prod = require('@/constants/system') as typeof import('@/constants/system')
      expect(prod.isProd()).toBe(true)
    })

    it('nhận diện local env', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'local' as any
      jest.resetModules()
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const local = require('@/constants/system') as typeof import('@/constants/system')
      expect(local.isLocal()).toBe(true)
      expect(local.isDev()).toBe(true)
    })

    it('fallback về production khi NEXT_PUBLIC_ENVIRONMENT không được set', () => {
      delete (process.env as any).NEXT_PUBLIC_ENVIRONMENT
      jest.resetModules()
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require('@/constants/system') as typeof import('@/constants/system')
      expect(mod.isProd()).toBe(true)
    })
  })
})
