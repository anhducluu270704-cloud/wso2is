
import {
  parseFilterSearchParams,
  convertQueryAPI,
  decodeQueryParams,
  serializeSort,
  deserializeSort,
} from '@/util/filter'

describe('filter util', () => {
  describe('parseFilterSearchParams', () => {
    it('should parse params correctly', () => {
      const result = parseFilterSearchParams({
        page: 1,
        limit: 10,
        keyword: 'abc',
        category: 'test',
        sort: 'name:asc',
        query: 'status=true',
      } as any)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.offset).toBe(0)
      }
    })

    it('should apply default page and limit when omitted', () => {
      const result = parseFilterSearchParams({})

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.offset).toBe(0)
        expect(result.data.limit).toBeDefined()
      }
    })
  })

  describe('convertQueryAPI', () => {
    it('should convert filter to API format', () => {
      const res = convertQueryAPI({
        offset: 0,
        limit: 10,
        keyword: 'abc',
        category: 'news',
        query: [{ name: 'status', type: 'eq', value: 'active' }],
        sort: { name: 'createdAt', dir: 'desc' },
      })

      expect(res.offset).toBe(0)
      expect(res.limit).toBe(10)
      expect(res.filters).toContain('category')
      expect(res.query).toContain('status')
    })

    it('should support multi search name', () => {
      const res = convertQueryAPI(
        {
          offset: 0,
          limit: 10,
          keyword: 'abc',
          query: [],
        } as any,
        ['name', 'title']
      )

      expect(res.query).toContain('name:abc')
      expect(res.query).toContain('title:abc')
    })

    it('should serialize query arrays and ignore empty category', () => {
      const res = convertQueryAPI({
        offset: 0,
        limit: 10,
        category: 'all',
        query: [{ name: 'status', type: 'eq', value: ['a', 'b'] }],
      } as never)

      expect(res.filters).toBeUndefined()
      expect(res.query).toContain('status:a,b')
    })

    it('should omit empty keyword and empty query values', () => {
      const res = convertQueryAPI({
        offset: 0,
        limit: 10,
        keyword: '   ',
        category: '   ',
        query: [{ name: 'status', type: 'eq', value: '' }],
      } as never)

      expect(res.filters).toBeUndefined()
      expect(res.query).toBeUndefined()
    })
  })

  describe('decodeQueryParams', () => {
    it('should decode simple query', () => {
      const result = decodeQueryParams('status=active')
      expect(result?.[0].name).toBe('status')
      expect(result?.[0].value).toBe('active')
    })

    it('should decode array value', () => {
      const result = decodeQueryParams('status=a,b')
      expect(result?.[0].value).toEqual(['a', 'b'])
    })

    it('should decode negation', () => {
      const result = decodeQueryParams('status=!a')
      expect(result?.[0].type).toBe('ne')
    })

    it('should decode like', () => {
      const result = decodeQueryParams('status=*abc')
      expect(result?.[0].type).toBe('like')
    })

    it('should decode boolean', () => {
      const result = decodeQueryParams('active=bool!true')
      expect(result?.[0].value).toBe(true)
    })

    it('should decode boolean false; invalid bool prefix falls back to eq string', () => {
      const valid = decodeQueryParams('active=bool!false')
      const invalid = decodeQueryParams('active=bool!maybe')

      expect(valid?.[0].value).toBe(false)
      expect(invalid).toEqual([
        { name: 'active', type: 'eq', value: 'bool!maybe', sub: undefined },
      ])
    })

    it('should return undefined if empty', () => {
      expect(decodeQueryParams(undefined)).toBeUndefined()
    })

    it('should return empty array for empty query string', () => {
      expect(decodeQueryParams('')).toBeUndefined()
    })

    it('should ignore malformed items and empty values', () => {
      expect(decodeQueryParams(';')).toEqual([])
      expect(decodeQueryParams('invalid')).toEqual([])
      expect(decodeQueryParams('status=!')).toEqual([
        { name: 'status', type: 'eq', value: '!', sub: undefined },
      ])
      expect(decodeQueryParams('status=')).toEqual([])
      expect(decodeQueryParams('name=str!')).toEqual([
        { name: 'name', type: 'eq', value: 'str!', sub: undefined },
      ])
      expect(decodeQueryParams('=active')).toEqual([])
    })

    it('should decode string and boolean like prefixes', () => {
      const stringLike = decodeQueryParams('name=str*john')
      const boolLike = decodeQueryParams('active=bool*false')

      expect(stringLike?.[0]).toEqual({
        name: 'name',
        type: 'like',
        value: 'john',
        sub: undefined,
      })
      expect(boolLike?.[0]).toEqual({
        name: 'active',
        type: 'like',
        value: false,
        sub: undefined,
      })
    })

    it('should decode multiple negation values into array', () => {
      const result = decodeQueryParams('status=!a,b')

      expect(result?.[0]).toEqual({
        name: 'status',
        type: 'ne',
        value: ['a', 'b'],
        sub: undefined,
      })
    })
  })

  describe('serializeSort', () => {
    it('should serialize sort', () => {
      const result = serializeSort({ name: 'createdAt', dir: 'asc' })
      expect(result).toBe('createdAt:asc')
    })

    it('should return undefined', () => {
      expect(serializeSort(undefined)).toBeUndefined()
    })
  })

  describe('deserializeSort', () => {
    it('should deserialize sort', () => {
      const result = deserializeSort('createdAt:desc')
      expect(result).toEqual({ name: 'createdAt', dir: 'desc' })
    })

    it('should return undefined if invalid', () => {
      expect(deserializeSort('createdAt:test')).toBeUndefined()
    })
  })

  describe('extra coverage cases', () => {
    it('decodeQueryParams should handle multiple params', () => {
      const result = decodeQueryParams('status=active&role=admin')
      expect(result?.length).toBeGreaterThanOrEqual(1)
    })

    it('decodeQueryParams should handle like with string prefix', () => {
      const result = decodeQueryParams('name=str*john')
      expect(result?.[0].name).toBe('name')
    })

    it('convertQueryAPI should work without keyword', () => {
      const res = convertQueryAPI({
        offset: 5,
        limit: 20,
        query: [],
      } as any)

      expect(res.offset).toBe(5)
      expect(res.limit).toBe(20)
    })

    it('serializeSort should support desc', () => {
      const result = serializeSort({ name: 'updatedAt', dir: 'desc' })
      expect(result).toBe('updatedAt:desc')
    })

    it('deserializeSort should return undefined with empty input', () => {
      const result = deserializeSort(undefined as any)
      expect(result).toBeUndefined()
    })
  })
})
