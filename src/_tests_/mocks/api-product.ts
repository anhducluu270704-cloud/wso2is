export const MOCK_API_PRODUCT = {
  id: 'api-1',
  name: 'Payment API',
  description: 'API for payments',
  context: '/payment/v1',
  version: '1.0',
  provider: 'Techcombank',
  status: 'PUBLISHED',
  thumbnailUrl: null,
}

export const MOCK_API_PRODUCT_LIST_RESPONSE = {
  message: 'OK',
  code: '200',
  data: {
    count: 1,
    list: [MOCK_API_PRODUCT],
    pagination: {
      offset: 0,
      limit: 10,
      total: 1,
      next: '',
      previous: '',
    },
  },
}
