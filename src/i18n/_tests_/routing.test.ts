
/**
 * Unit test: i18n - routing và constants
 */
import { LOCALES_DEFAULT, LOCALES_LIST } from '@/constants/locales'

jest.mock('next-intl/routing', () => ({
  defineRouting: (opts: { locales: string[]; defaultLocale: string; localePrefix: string }) =>
    opts,
}))

import { routing } from '../routing'

describe('i18n - routing constants', () => {
  it('LOCALES_LIST chứa ít nhất 1 locale', () => {
    expect(LOCALES_LIST.length).toBeGreaterThanOrEqual(1)
    expect(LOCALES_LIST).toContain('vi')
  })
  it('LOCALES_DEFAULT nằm trong LOCALES_LIST', () => {
    expect(LOCALES_LIST).toContain(LOCALES_DEFAULT)
  })
  it('LOCALES_DEFAULT là vi', () => {
    expect(LOCALES_DEFAULT).toBe('vi')
  })
})

describe('i18n/routing', () => {
  it('routing có locales, defaultLocale, localePrefix', () => {
    expect(routing.locales).toEqual(LOCALES_LIST)
    expect(routing.defaultLocale).toBe(LOCALES_DEFAULT)
    expect(routing.localePrefix).toBe('always')
  })
})
