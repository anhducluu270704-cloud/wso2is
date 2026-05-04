
/**
 * Unit test: services/auth - authApi với mock axiosClient
 */
import authApi from '../auth.service'
import { MOCK_AUTH_INFO_BASE, MOCK_SIGN_UP_REQUEST } from '@/_tests_/mocks'

jest.mock('@/libs/axiosClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
  },
}))

const axiosClient = require('@/libs/axiosClient').default

describe('services/auth/auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('signIn gọi GET /auth/login với callback', async () => {
    ;(axiosClient.get as jest.Mock).mockResolvedValue({ data: 'https://login.url' })
    await authApi.signIn('https://app/callback')
    expect(axiosClient.get).toHaveBeenCalledWith('/auth/login', {
      params: { callback: 'https://app/callback' },
    })
  })

  it('getToken gọi POST /auth/token', async () => {
    ;(axiosClient.post as jest.Mock).mockResolvedValue({ data: MOCK_AUTH_INFO_BASE })
    await authApi.getToken({ code: 'code123', redirect_uri: 'https://app/callback' })
    expect(axiosClient.post).toHaveBeenCalledWith('/auth/token', {
      code: 'code123',
      redirect_uri: 'https://app/callback',
    })
  })

  it('signUp gọi POST /auth/register với body đã trim', async () => {
    ;(axiosClient.post as jest.Mock).mockResolvedValue({})
    const body = { ...MOCK_SIGN_UP_REQUEST }
    await authApi.signUp(body)
    expect(axiosClient.post).toHaveBeenCalledWith('/auth/register', expect.any(Object))
  })

  it('refresh gọi POST /auth/refresh', async () => {
    ;(axiosClient.post as jest.Mock).mockResolvedValue({ data: MOCK_AUTH_INFO_BASE })
    await authApi.refresh({ refreshToken: 'ref-123' })
    expect(axiosClient.post).toHaveBeenCalledWith('/auth/refresh', expect.any(Object))
  })

  it('logout gọi GET /auth/logout với idToken và callback', async () => {
    ;(axiosClient.get as jest.Mock).mockResolvedValue({})
    await authApi.logout({ idToken: 'id-123', callback: 'https://app' })
    expect(axiosClient.get).toHaveBeenCalledWith('/auth/logout', {
      params: { idToken: 'id-123', callback: 'https://app' },
    })
  })
})
