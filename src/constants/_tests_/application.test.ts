
import {
  APPLICATION_LIST_INITIAL_PAGE_SIZE,
  APPLICATION_LIST_PAGE_SIZE,
  APPLICATION_STATUS,
  DEFAULT_GRANT_TYPES,
  FALLBACK_TOAST_DURATION_MS,
  TOAST_EXIT_ANIMATION_MS,
} from '@/constants/application'
import {
  HTTP_REFERER_PATTERN,
  IPV4_WITH_OPTIONAL_CIDR,
  IPV6_WITH_OPTIONAL_CIDR,
} from '@/constants/regex'

describe('constants/application', () => {
  it('exports static application metadata', () => {
    expect(APPLICATION_STATUS).toEqual([
      'ACTIVE',
      'INACTIVE',
      'PENDING',
      'APPROVED',
    ])
    expect(APPLICATION_LIST_PAGE_SIZE).toBe(3)
    expect(APPLICATION_LIST_INITIAL_PAGE_SIZE).toBe(6)
    expect(FALLBACK_TOAST_DURATION_MS).toBe(5000)
    expect(TOAST_EXIT_ANIMATION_MS).toBe(300)
    expect(DEFAULT_GRANT_TYPES).toEqual(['password', 'client_credentials'])
  })

  it('exports IP validation helpers', () => {
    expect(IPV4_WITH_OPTIONAL_CIDR.test('192.168.1.1')).toBe(true)
    expect(IPV6_WITH_OPTIONAL_CIDR.test('2001:db8::1')).toBe(true)
  })

  describe('HTTP_REFERER_PATTERN', () => {
    it('accepts supported host and wildcard patterns', () => {
      expect(HTTP_REFERER_PATTERN.test('www.example.com/path')).toBe(true)
      expect(HTTP_REFERER_PATTERN.test('sub.example.com/*')).toBe(true)
      expect(HTTP_REFERER_PATTERN.test('*.example.com/*')).toBe(true)
    })

    it('rejects invalid patterns', () => {
      expect(HTTP_REFERER_PATTERN.test('https://example.com')).toBe(false)
      expect(HTTP_REFERER_PATTERN.test('example .com')).toBe(false)
    })
  })
})