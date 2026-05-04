
/**
 * Unit test: services/api-product - apiProductApi với mock axiosClient
 */
import apiProductApi from '../apiProduct.service'

jest.mock('@/libs/axiosClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({}),
  },
}))

const axiosClient = require('@/libs/axiosClient').default

describe('services/api-product/apiProduct.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getAll gọi GET /api-product/list với params', async () => {
    ;(axiosClient.get as jest.Mock).mockResolvedValue({ data: { list: [] } })
    await apiProductApi.getAll({ limit: 10, offset: 0 })
    expect(axiosClient.get).toHaveBeenCalledWith('/api-product/list', { params: expect.any(Object) })
  })

  it('getDetail gọi GET /api-product/:id', async () => {
    ;(axiosClient.get as jest.Mock).mockResolvedValue({})
    await apiProductApi.getDetail('api-1')
    expect(axiosClient.get).toHaveBeenCalledWith('/api-product/api-1')
  })

  it('getCategories gọi GET /api-product/categories', async () => {
    ;(axiosClient.get as jest.Mock).mockResolvedValue({})
    await apiProductApi.getCategories()
    expect(axiosClient.get).toHaveBeenCalledWith('/api-product/categories')
  })

  it('getThumbnail gọi GET với responseType blob', async () => {
    const blob = new Blob(['image'])
    ;(axiosClient.get as jest.Mock).mockResolvedValue(blob)
    const result = await apiProductApi.getThumbnail('api-1')
    expect(axiosClient.get).toHaveBeenCalledWith('/api-product/api-1/thumbnail', {
      responseType: 'blob',
    })
    expect(result).toBe(blob)
  })
})
