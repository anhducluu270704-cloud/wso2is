
/**
 * Unit test: models/api/common - FilterSchema, PaginationSchema, BaseAPIResponse
 */
import {
  FilterSchema,
  FilterQuerySchema,
  FilterSortSchema,
  PaginationSchema,
  BaseAPIResponseSchema,
} from '@/models/api/common'

describe('models/api/common', () => {
  describe('FilterSchema', () => {
    it('parse filter hợp lệ', () => {
      const result = FilterSchema.safeParse({
        limit: 10,
        offset: 0,
        keyword: 'test',
        sort: { name: 'created', dir: 'asc' },
      })
      expect(result.success).toBe(true)
    })
    it('default limit và offset', () => {
      const result = FilterSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.limit).toBe(5)
        expect(result.data.offset).toBe(0)
      }
    })
  })

  describe('FilterQuerySchema', () => {
    it('chấp nhận type eq, ne, like', () => {
      expect(FilterQuerySchema.safeParse({ name: 'a', type: 'eq', value: 'x' }).success).toBe(true)
      expect(FilterQuerySchema.safeParse({ name: 'a', type: 'ne', value: 'x' }).success).toBe(true)
      expect(FilterQuerySchema.safeParse({ name: 'a', type: 'like', value: 'x' }).success).toBe(true)
    })
  })

  describe('FilterSortSchema', () => {
    it('chỉ chấp nhận dir asc hoặc desc', () => {
      expect(FilterSortSchema.safeParse({ name: 'x', dir: 'asc' }).success).toBe(true)
      expect(FilterSortSchema.safeParse({ name: 'x', dir: 'desc' }).success).toBe(true)
      expect(FilterSortSchema.safeParse({ name: 'x', dir: 'invalid' }).success).toBe(false)
    })
  })

  describe('PaginationSchema', () => {
    it('parse pagination', () => {
      const result = PaginationSchema.safeParse({
        offset: 0,
        limit: 10,
        total: 100,
        next: '',
        previous: '',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('BaseAPIResponseSchema', () => {
    it('parse response cơ bản', () => {
      const result = BaseAPIResponseSchema.safeParse({
        message: 'OK',
        code: '200',
      })
      expect(result.success).toBe(true)
    })
  })
})
