
/**
 * Unit test: util/avatar - getInitials
 */
import { getInitials } from '@/util/avatar'

describe('util/avatar getInitials', () => {
  it('trả về "?" khi name null hoặc undefined', () => {
    expect(getInitials(null)).toBe('?')
    expect(getInitials(undefined)).toBe('?')
  })

  it('trả về "?" khi name chuỗi rỗng hoặc chỉ khoảng trắng', () => {
    expect(getInitials('')).toBe('?')
    expect(getInitials('   ')).toBe('?')
  })

  it('lấy 2 chữ cái đầu khi có 1 từ', () => {
    expect(getInitials('John')).toBe('JO')
    expect(getInitials('A')).toBe('AA')
  })

  it('lấy 2 chữ cái đầu khi có 2 từ trở lên (2 ký tự cuối của chuỗi chữ cái đầu)', () => {
    expect(getInitials('Nguyen Van A')).toBe('VA')
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('trim khoảng trắng thừa', () => {
    expect(getInitials('  John  Doe  ')).toBe('JD')
  })
})
