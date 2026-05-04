
const postRecaptchaVerify = jest.fn()

jest.mock('@/services/recaptcha/recaptcha.verify', () => ({
  postRecaptchaVerify: (...a: unknown[]) => postRecaptchaVerify(...a),
}))

import { POST } from '../route'

describe('app/api/recaptcha/verify/route', () => {
  beforeEach(() => {
    postRecaptchaVerify.mockReset()
  })

  it('ủy quyền POST(request) cho postRecaptchaVerify', async () => {
    const expected = { status: 200 } as unknown as Response
    postRecaptchaVerify.mockResolvedValue(expected)

    const req = { method: 'POST' } as unknown as Request

    const res = await POST(req)

    expect(postRecaptchaVerify).toHaveBeenCalledTimes(1)
    expect(postRecaptchaVerify.mock.calls[0][0]).toBe(req)
    expect(res).toBe(expected)
  })
})
