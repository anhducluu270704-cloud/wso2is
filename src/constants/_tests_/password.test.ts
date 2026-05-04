
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_REQUIREMENT_KEYS,
} from '@/constants/password'

describe('constants/password', () => {
  it('PASSWORD_MIN_LENGTH 8, PASSWORD_MAX_LENGTH 20', () => {
    expect(PASSWORD_MIN_LENGTH).toBe(8)
    expect(PASSWORD_MAX_LENGTH).toBe(20)
  })
  it('PASSWORD_REQUIREMENT_KEYS có 5 keys khớp PasswordChecks', () => {
    expect(PASSWORD_REQUIREMENT_KEYS).toHaveLength(5)
    expect(PASSWORD_REQUIREMENT_KEYS).toEqual([
      'length',
      'upper',
      'lower',
      'digit',
      'special',
    ])
  })
})