jest.mock('next-intl/middleware', () => jest.fn(() => jest.fn()))
jest.mock('@/i18n/routing', () => ({ routing: {} }))

let proxyHandler!: typeof import('@/proxy').default
let proxyConfig!: typeof import('@/proxy').config

beforeAll(async () => {
  const mod = await import('@/proxy')
  proxyHandler = mod.default
  proxyConfig = mod.config
})

describe('proxy (i18n)', () => {
  it('export config với matcher đúng', () => {
    expect(proxyConfig).toBeDefined()
    expect(proxyConfig.matcher).toContain('api')
    expect(proxyConfig.matcher).toContain('_next')
    expect(proxyConfig.matcher).toContain('.*')
  })

  it('export default (proxy handler)', () => {
    expect(proxyHandler).toBeDefined()
    expect(typeof proxyHandler).toBe('function')
  })
})
