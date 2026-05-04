
jest.mock('axios', () => {
  const mockPost = jest.fn()
  const mockCreate = jest.fn(() => ({
    post: mockPost,
    interceptors: {
      response: {
        use: jest.fn(),
      },
    },
  }))
  return {
    __esModule: true,
    default: {
      create: mockCreate,
    },
    AxiosResponse: {},
    __recaptchaMocks: { mockPost, mockCreate },
  }
})

import * as axiosModule from 'axios'

import { RECAPTCHA_VERIFY_URL } from '@/constants/recaptcha'

import recaptchaApi from '../recaptcha.service'

const { mockPost, mockCreate } = (axiosModule as unknown as {
  __recaptchaMocks: { mockPost: jest.Mock; mockCreate: jest.Mock }
}).__recaptchaMocks

describe('services/recaptcha/recaptcha.service', () => {
  beforeEach(() => {
    mockPost.mockReset()
  })

  it('siteVerify POST form-urlencoded với URLSearchParams từ body', async () => {
    mockPost.mockResolvedValue({
      success: true,
      score: 0.9,
    })

    const out = await recaptchaApi.siteVerify({
      secret: 'sec',
      response: 'tok',
    })

    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPost.mock.calls[0][0]).toBe('')
    expect(mockPost.mock.calls[0][1]).toBeInstanceOf(URLSearchParams)
    expect(String(mockPost.mock.calls[0][1])).toBe('secret=sec&response=tok')
    expect(out).toEqual({ success: true, score: 0.9 })
  })

  it('axios.create nhận header x-www-form-urlencoded và timeout', () => {
    expect(mockCreate).toHaveBeenCalled()
    const [config] = mockCreate.mock.calls[0]
    expect(config.headers['Content-Type']).toBe('application/x-www-form-urlencoded')
    expect(typeof config.timeout).toBe('number')
  })

  it('axios.create baseURL là env hoặc RECAPTCHA_VERIFY_URL mặc định', () => {
    const [config] = mockCreate.mock.calls[0]
    expect(config.baseURL).toBe(
      process.env.RECAPTCHA_VERIFY_URL ?? RECAPTCHA_VERIFY_URL,
    )
  })
})
