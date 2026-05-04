
/**
 * Unit test: i18n/navigation - exports từ createNavigation
 */
jest.mock('next-intl/navigation', () => ({
  createNavigation: jest.fn(() => ({
    Link: 'Link',
    redirect: jest.fn(),
    usePathname: jest.fn(),
    useRouter: jest.fn(),
    getPathname: jest.fn(),
  })),
}))

jest.mock('../routing', () => ({ routing: { locales: ['vi', 'en'], defaultLocale: 'vi' } }))

import { Link, redirect, usePathname, useRouter, getPathname } from '../navigation'

describe('i18n/navigation', () => {
  it('export Link', () => {
    expect(Link).toBe('Link')
  })
  it('export redirect', () => {
    expect(typeof redirect).toBe('function')
  })
  it('export usePathname', () => {
    expect(typeof usePathname).toBe('function')
  })
  it('export useRouter', () => {
    expect(typeof useRouter).toBe('function')
  })
  it('export getPathname', () => {
    expect(typeof getPathname).toBe('function')
  })
})
