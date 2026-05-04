
/**
 * Unit test: share/lib/utils - cn
 */
import { cn } from '@/share/lib/utils'

describe('share/lib/utils', () => {
  describe('cn', () => {
    it('merge nhiều class', () => {
      expect(cn('a', 'b')).toBe('a b')
    })
    it('bỏ falsy', () => {
      expect(cn('a', false, 'b', undefined, null)).toBe('a b')
    })
    it('merge tailwind conflict', () => {
      expect(cn('px-2', 'px-4')).toContain('px-4')
    })
  })
})
