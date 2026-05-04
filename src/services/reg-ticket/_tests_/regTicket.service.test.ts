import regTicketApi from '../regTicket.service'

const axiosPost = jest.fn()

jest.mock('@/libs/axiosClient', () => ({
  __esModule: true,
  default: {
    post: (...args: unknown[]) => axiosPost(...args),
  },
}))

describe('services/reg-ticket/regTicket.service', () => {
  beforeEach(() => {
    axiosPost.mockReset()
  })

  it('create POST /openapi-reg-integration với body', async () => {
    axiosPost.mockResolvedValue({})
    const body = { a: 1 }
    await regTicketApi.create(body)
    expect(axiosPost).toHaveBeenCalledWith('/openapi-reg-integration', body)
  })
})
