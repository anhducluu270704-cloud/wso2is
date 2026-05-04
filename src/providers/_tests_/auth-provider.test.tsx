
import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../auth-provider'
import { MOCK_AUTH_FULL_INFO, MOCK_AUTH_INFO_BASE } from '@/_tests_/mocks'
import {
  AUTH_BROADCAST_CHANNEL,
  AUTH_CURRENT_PAGE_KEY,
  AUTH_INFO_KEY,
  TOKEN_KEY,
} from '@/constants/system'

// Stable router object so AuthProvider's useEffect([router, ...]) does not loop on new refs each render.
var authNavTestState!: {
  pathname: string
  router: { push: jest.Mock; replace: jest.Mock; refresh: jest.Mock }
}

jest.mock('@/i18n/navigation', () => {
  authNavTestState = {
    pathname: '/',
    router: {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
    },
  }
  return {
    useRouter: () => authNavTestState.router,
    usePathname: () => authNavTestState.pathname,
  }
})

const mockPush = authNavTestState.router.push
const mockReplace = authNavTestState.router.replace
const mockRefresh = authNavTestState.router.refresh
const mockLogoutMutate = jest.fn()
const mockRefreshMutate = jest.fn()
const mockCallback = jest.fn()
let logoutOnSuccess: () => void = () => {}
jest.mock('next-intl', () => ({
  useLocale: () => 'vi',
  useTranslations: () => (key: string) => key,
}))
jest.mock('@/share/hooks/login-redirect', () => ({
  fetchLoginPageUrl: jest.fn(() =>
    Promise.resolve('https://idp.example/login?ui_locales=vi_VN'),
  ),
}))
jest.mock('@/services/auth/auth.query-options', () => ({
  useLogout: (onSuccess: () => void) => {
    logoutOnSuccess = onSuccess
    return { mutate: mockLogoutMutate }
  },
  useRefresh: () => ({ mutate: mockRefreshMutate }),
}))
jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

const localStorageState: Record<string, string> = {}
const sessionStorageState: Record<string, string> = {}
const originalBroadcastChannel = global.BroadcastChannel
const originalConsoleError = console.error
const channels: MockBroadcastChannel[] = []
const { toast } = jest.requireMock('sonner') as {
  toast: { success: jest.Mock; error: jest.Mock }
}
const { fetchLoginPageUrl: mockFetchLoginPageUrl } = jest.requireMock(
  '@/share/hooks/login-redirect',
) as { fetchLoginPageUrl: jest.Mock }

class MockBroadcastChannel {
  name: string
  onmessage: ((event: { data: 'changed' | 'logout' }) => void) | null = null
  postMessage = jest.fn()
  close = jest.fn()

  constructor(name: string) {
    this.name = name
    channels.push(this)
  }
}

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn((key: string) => localStorageState[key] ?? null),
      setItem: jest.fn((key: string, value: string) => {
        localStorageState[key] = value
      }),
      removeItem: jest.fn((key: string) => {
        delete localStorageState[key]
      }),
      clear: jest.fn(() => {
        Object.keys(localStorageState).forEach((key) => delete localStorageState[key])
      }),
    },
    writable: true,
  })

  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: jest.fn((key: string) => sessionStorageState[key] ?? null),
      setItem: jest.fn((key: string, value: string) => {
        sessionStorageState[key] = value
      }),
      removeItem: jest.fn((key: string) => {
        delete sessionStorageState[key]
      }),
      clear: jest.fn(() => {
        Object.keys(sessionStorageState).forEach((key) => delete sessionStorageState[key])
      }),
    },
    writable: true,
  })
})

beforeEach(() => {
  jest.useRealTimers()
  Object.keys(localStorageState).forEach((key) => delete localStorageState[key])
  Object.keys(sessionStorageState).forEach((key) => delete sessionStorageState[key])
  channels.length = 0
  authNavTestState.pathname = '/'
  mockPush.mockClear()
  mockReplace.mockClear()
  mockRefresh.mockClear()
  mockFetchLoginPageUrl.mockClear()
  mockFetchLoginPageUrl.mockResolvedValue(
    'https://idp.example/login?ui_locales=vi_VN',
  )
  mockLogoutMutate.mockClear()
  mockLogoutMutate.mockImplementation(() => {
    logoutOnSuccess()
  })
  mockRefreshMutate.mockClear()
  toast.success.mockClear()
  toast.error.mockClear()
  mockCallback.mockClear()
  ;(window.localStorage.getItem as jest.Mock).mockClear()
  ;(window.localStorage.setItem as jest.Mock).mockClear()
  ;(window.localStorage.removeItem as jest.Mock).mockClear()
  ;(window.sessionStorage.getItem as jest.Mock).mockClear()
  ;(window.sessionStorage.setItem as jest.Mock).mockClear()
  ;(window.sessionStorage.removeItem as jest.Mock).mockClear()
  global.BroadcastChannel = MockBroadcastChannel as never
  console.error = jest.fn()
})

afterAll(() => {
  global.BroadcastChannel = originalBroadcastChannel
  console.error = originalConsoleError
})

function Consumer() {
  const { token, isLoading, login, logout } = useAuth()
  return (
    <div>
      <span data-testid="token">{token ?? 'null'}</span>
      <span data-testid="loading">{String(isLoading)}</span>
      <button onClick={() => login(MOCK_AUTH_INFO_BASE)}>
        Login
      </button>
      <button
        onClick={() =>
          login(
            {
              ...MOCK_AUTH_INFO_BASE,
              expires_in: 11,
            },
            { callback: mockCallback, isNotSendBroadcast: true }
          )
        }
      >
        Login Silent
      </button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => logout({ callback: mockCallback, isNotSendBroadcast: true })}>
        Logout Silent
      </button>
    </div>
  )
}

describe('AuthProvider', () => {
  it('render children và provide context', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await screen.findByTestId('token')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
  })

  it('useAuth ném lỗi khi dùng ngoài AuthProvider', () => {
    function Bad() {
      useAuth()
      return null
    }
    expect(() => render(<Bad />)).toThrow('useAuth must be used within AuthProvider')
  })

  it('login set token, authInfo và gửi broadcast', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    await userEvent.click(screen.getByText('Login'))

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      TOKEN_KEY,
      MOCK_AUTH_FULL_INFO.access_token
    )
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      AUTH_INFO_KEY,
      expect.stringContaining('"access_token"')
    )
    expect(channels.at(-1)?.name).toBe(AUTH_BROADCAST_CHANNEL)
  })

  it('logout gọi mutation, clear storage và toast khi đã login', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    await userEvent.click(screen.getByText('Login'))
    await userEvent.click(screen.getByText('Logout'))

    expect(mockLogoutMutate).toHaveBeenCalledWith({
      idToken: MOCK_AUTH_FULL_INFO.id_token,
      callback: window.location.origin,
    })
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(TOKEN_KEY)
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(AUTH_INFO_KEY)
    expect(toast.success).toHaveBeenCalledWith(
      'mess.logout.success',
      expect.any(Object),
    )
  })

  it('initAuth load dữ liệu hợp lệ từ localStorage', async () => {
    localStorageState[TOKEN_KEY] = MOCK_AUTH_INFO_BASE.access_token
    localStorageState[AUTH_INFO_KEY] = JSON.stringify(MOCK_AUTH_INFO_BASE)

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    expect(await screen.findByTestId('token')).toHaveTextContent(
      MOCK_AUTH_INFO_BASE.access_token
    )
  })

  it('initAuth bỏ qua authInfo không hợp lệ', async () => {
    localStorageState[TOKEN_KEY] = MOCK_AUTH_INFO_BASE.access_token
    localStorageState[AUTH_INFO_KEY] = JSON.stringify({ invalid: true })

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    expect(await screen.findByTestId('token')).toHaveTextContent('null')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
  })

  it('login/logout silent gọi callback và không broadcast', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    await userEvent.click(screen.getByText('Login Silent'))
    await userEvent.click(screen.getByText('Logout Silent'))

    expect(mockCallback).toHaveBeenCalledTimes(2)
    expect(channels).toHaveLength(1)
  })

  it('sendAuthEvent set session flag rồi xóa sau timeout', async () => {
    jest.useFakeTimers()
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    fireEvent.click(screen.getByText('Login'))

    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      AUTH_CURRENT_PAGE_KEY,
      'true'
    )

    jest.advanceTimersByTime(1000)

    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith(
      AUTH_CURRENT_PAGE_KEY
    )
  })

  it('broadcast changed khi vẫn còn token trong storage sẽ sync và refresh router', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    localStorageState[TOKEN_KEY] = MOCK_AUTH_INFO_BASE.access_token
    localStorageState[AUTH_INFO_KEY] = JSON.stringify(MOCK_AUTH_INFO_BASE)
    channels.at(-1)?.onmessage?.({ data: 'changed' })

    expect(mockRefresh).toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
    expect(await screen.findByTestId('token')).toHaveTextContent(
      MOCK_AUTH_INFO_BASE.access_token,
    )
  })

  it('broadcast changed khi storage đã trống mở URL đăng nhập từ API', async () => {
    authNavTestState.pathname = '/profile'

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    channels.at(-1)?.onmessage?.({ data: 'changed' })

    await waitFor(() =>
      expect(mockFetchLoginPageUrl).toHaveBeenCalledWith('vi'),
    )
    expect(mockReplace).not.toHaveBeenCalled()
    expect(mockRefresh).not.toHaveBeenCalled()
  })

  it('broadcast logout sẽ clear context và redirect IdP', async () => {
    localStorageState[TOKEN_KEY] = MOCK_AUTH_INFO_BASE.access_token
    localStorageState[AUTH_INFO_KEY] = JSON.stringify(MOCK_AUTH_INFO_BASE)

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    expect(await screen.findByTestId('token')).toHaveTextContent(
      MOCK_AUTH_INFO_BASE.access_token,
    )

    delete localStorageState[TOKEN_KEY]
    delete localStorageState[AUTH_INFO_KEY]
    channels.at(-1)?.onmessage?.({ data: 'logout' })

    await waitFor(() =>
      expect(mockFetchLoginPageUrl).toHaveBeenCalledWith('vi'),
    )
    expect(mockReplace).not.toHaveBeenCalled()
    expect(await screen.findByTestId('token')).toHaveTextContent('null')
  })

  it('logout không gọi mutation khi chưa có authInfo nhưng vẫn broadcast', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    await userEvent.click(screen.getByText('Logout'))

    expect(mockLogoutMutate).not.toHaveBeenCalled()
    expect(channels.length).toBeGreaterThanOrEqual(1)
  })

  it('broadcast bỏ qua khi current page flag đang true', () => {
    sessionStorageState[AUTH_CURRENT_PAGE_KEY] = 'true'

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    channels.at(-1)?.onmessage?.({ data: 'changed' })

    expect(mockPush).not.toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
    expect(mockRefresh).not.toHaveBeenCalled()
    expect(mockFetchLoginPageUrl).not.toHaveBeenCalled()
  })

  it('handle lỗi trong broadcast message', () => {
    ;(window.sessionStorage.getItem as jest.Mock).mockImplementation(() => {
      throw new Error('session broken')
    })

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    channels.at(-1)?.onmessage?.({ data: 'changed' })

    expect(toast.error).toHaveBeenCalledWith('Error: session broken')
  })

  it('refreshMutation được gọi khi refresh_at đến hạn', async () => {
    jest.useFakeTimers()

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    fireEvent.click(screen.getByText('Login Silent'))
    jest.advanceTimersByTime(1001)

    expect(mockRefreshMutate).toHaveBeenCalledWith({
      body: { refreshToken: MOCK_AUTH_INFO_BASE.refresh_token },
    })
  })

  it('log lỗi khi tạo BroadcastChannel thất bại trong effect', () => {
    global.BroadcastChannel = class {
      constructor() {
        throw new Error('create failed')
      }
    } as never

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    expect(toast.error).toHaveBeenCalledWith('Error: create failed')
  })

  it('log lỗi khi đóng BroadcastChannel thất bại ở cleanup', () => {
    global.BroadcastChannel = class {
      onmessage = null
      close() {
        throw new Error('close failed')
      }
    } as never

    const { unmount } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    unmount()

    expect(toast.error).toHaveBeenCalledWith('Error: close failed')
  })

  it('log lỗi khi postMessage và close trong sendAuthEvent thất bại', async () => {
    global.BroadcastChannel = class {
      onmessage = null
      postMessage() {
        throw new Error('post failed')
      }
      close() {
        throw new Error('close failed')
      }
    } as never

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    await userEvent.click(screen.getByText('Login'))

    expect(toast.error).toHaveBeenCalledWith('Error: post failed')
    expect(toast.error).toHaveBeenCalledWith('Error: close failed')
  })

  it('log lỗi khi tạo auth channel thất bại trong sendAuthEvent', async () => {
    global.BroadcastChannel = class {
      constructor() {
        throw new Error('auth create failed')
      }
    } as never

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    await userEvent.click(screen.getByText('Login'))

    expect(toast.error).toHaveBeenCalledWith('Error: auth create failed')
  })
})
