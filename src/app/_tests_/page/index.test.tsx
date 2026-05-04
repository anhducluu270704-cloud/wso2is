
import { describe, it, expect, jest } from '@jest/globals'

jest.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
    localePrefix: 'always',
    localeDetection: false,
  },
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('RootPage', () => {
  it('redirects to default locale segment', async () => {
    const { default: RootPage } = await import('../../page')
    const { redirect } = await import('next/navigation')

    RootPage()

    expect(redirect).toHaveBeenCalledWith('vi')
  })
})

