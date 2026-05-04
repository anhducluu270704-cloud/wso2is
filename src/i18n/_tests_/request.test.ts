
/**
 * Unit test: i18n/request - getRequestConfig default export
 */
const mockHasLocale = jest.fn((_locales: string[], requested: string) =>
  ['vi', 'en'].includes(requested)
)
const mockRouting = { locales: ['vi', 'en'], defaultLocale: 'vi' }

let capturedConfigFn: ((opts: { requestLocale: Promise<string> }) => Promise<unknown>) | null =
  null
jest.mock('next-intl/server', () => ({
  getRequestConfig: jest.fn((fn: (opts: { requestLocale: Promise<string> }) => Promise<unknown>) => {
    capturedConfigFn = fn
    return fn
  }),
}))
jest.mock('next-intl', () => ({ hasLocale: mockHasLocale }))
jest.mock('../routing', () => ({ routing: mockRouting }))

describe('i18n/request', () => {
  beforeEach(() => {
    mockHasLocale.mockImplementation((_l: string[], req: string) =>
      ['vi', 'en'].includes(req)
    )
  })

  it('default export là function từ getRequestConfig', async () => {
    const mod = require('../request').default
    expect(typeof mod).toBe('function')
    const result = await mod({ requestLocale: Promise.resolve('vi') })
    expect(result).toHaveProperty('locale', 'vi')
    expect(result).toHaveProperty('messages')
  })

  it('dùng defaultLocale khi requestLocale không trong locales', async () => {
    mockHasLocale.mockReturnValue(false)
    if (!capturedConfigFn) require('../request')
    const result = await capturedConfigFn!({ requestLocale: Promise.resolve('xx') })
    expect(result).toHaveProperty('locale', 'vi')
  })
})
