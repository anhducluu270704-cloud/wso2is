
/**
 * Unit test: services/support - supportApi với mock axiosClient
 */
import supportApi from '../support.service'

jest.mock('@/libs/axiosClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
  },
}))

const axiosClient = require('@/libs/axiosClient').default

describe('services/support/support.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getFaqs gọi GET /faqs với params từ convertQueryAPI', async () => {
    ;(axiosClient.get as jest.Mock).mockResolvedValue({ data: { list: [] } })
    await supportApi.getFaqs({ limit: 10, offset: 0 })
    expect(axiosClient.get).toHaveBeenCalledWith('/faqs', { params: expect.any(Object) })
  })

  it('getGuideCategories gọi GET /document-guides/categories', async () => {
    ;(axiosClient.get as jest.Mock).mockResolvedValue({ data: [] })
    await supportApi.getGuideCategories()
    expect(axiosClient.get).toHaveBeenCalledWith('/document-guides/categories')
  })

  it('getGuideDocuments gọi GET /document-guides với categoryId và convertQueryAPI', async () => {
    ;(axiosClient.get as jest.Mock).mockResolvedValue({ data: { list: [] } })
    await supportApi.getGuideDocuments('cat-1', { limit: 10, offset: 0 })
    expect(axiosClient.get).toHaveBeenCalledWith('/document-guides', {
      params: expect.objectContaining({
        categoryId: 'cat-1',
        limit: 10,
        offset: 0,
      }),
    })
  })

  it('create gọi POST /support/request', async () => {
    ;(axiosClient.post as jest.Mock).mockResolvedValue({})
    await supportApi.create({
      full_name: 'User',
      email: 'user@company.com',
      company_name: 'Co',
      phone_number: '0901234567',
      request_type: 'question',
      description: 'Desc',
    })
    expect(axiosClient.post).toHaveBeenCalledWith('/support/request', expect.any(Object))
  })
})
