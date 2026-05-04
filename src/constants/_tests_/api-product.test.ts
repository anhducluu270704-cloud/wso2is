
import {
  ALL_CATEGORY,
  ITEMS_PER_PAGE,
  DEFAULT_OFFSET,
  API_PRODUCT_SEARCH_FIELDS,
} from '@/constants/api-product'

describe('constants/api-product', () => {
  it('ALL_CATEGORY là all', () => {
    expect(ALL_CATEGORY).toBe('all')
  })
  it('ITEMS_PER_PAGE, DEFAULT_OFFSET', () => {
    expect(ITEMS_PER_PAGE).toBe(8)
    expect(DEFAULT_OFFSET).toBe(0)
  })
  it('API_PRODUCT_SEARCH_FIELDS chứa name', () => {
    expect(API_PRODUCT_SEARCH_FIELDS).toContain('name')
  })
  it('không còn SEARCH_SUGGESTIONS', async () => {
    const module = await import('@/constants/api-product')
    expect('SEARCH_SUGGESTIONS' in module).toBe(false)
  })
})