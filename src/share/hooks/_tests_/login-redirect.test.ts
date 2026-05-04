import { LOCALE_SELECTED_KEY } from '@/constants/system'
import authApi from '@/services/auth/auth.service'
import { buildLoginUrlWithUiLang, fetchLoginPageUrl } from '../login-redirect'

jest.mock('@/services/auth/auth.service', () => ({
  __esModule: true,
  default: {
    signIn: jest.fn(),
  },
}))

const mockSignIn = authApi.signIn as jest.Mock

function installLocalStorageMock(store: Record<string, string | null>) {
  const ls = {
    getItem: jest.fn((key: string) =>
      Object.prototype.hasOwnProperty.call(store, key) ? store[key]! : null
    ),
    setItem: jest.fn((key: string, v: string) => {
      store[key] = v
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((k) => delete store[k])
    }),
  }
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    writable: true,
    value: ls,
  })
  return ls
}

describe('share/hooks/login-redirect', () => {
  const savedLs = window.localStorage

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      writable: true,
      value: savedLs,
    })
  })

  beforeEach(() => {
    mockSignIn.mockReset()
  })

  it('buildLoginUrlWithUiLang thêm ui_locales mặc định vi_VN khi localStorage trống', () => {
    installLocalStorageMock({})
    const url = buildLoginUrlWithUiLang('https://idp.example/oauth/authorize')
    expect(url).toMatch(/ui_locales=vi_VN/)
  })

  it('buildLoginUrlWithUiLang dùng locale đã lưu', () => {
    installLocalStorageMock({ [LOCALE_SELECTED_KEY]: 'en_US' })
    const url = buildLoginUrlWithUiLang('https://idp.example/oauth/authorize')
    expect(url).toMatch(/ui_locales=en_US/)
  })

  it('fetchLoginPageUrl gọi signIn với callback rồi trả URL có ui_locales', async () => {
    installLocalStorageMock({})
    mockSignIn.mockResolvedValue({ data: 'https://idp.example/login' })
    const result = await fetchLoginPageUrl('en')
    expect(mockSignIn).toHaveBeenCalledWith(
      `${window.location.origin}/en/get-token`
    )
    expect(result).toMatch(/ui_locales=/)
    expect(result.startsWith('https://idp.example/login')).toBe(true)
  })
})
