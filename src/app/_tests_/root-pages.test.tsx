
import React from 'react'
import { render, screen } from '@testing-library/react'

const mockRedirect = jest.fn()

jest.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
    localePrefix: 'always',
    localeDetection: false,
  },
}))

jest.mock('next/navigation', () => ({
  redirect: (href: string) => mockRedirect(href),
}))

jest.mock('@/share/components/full-page/404', () => ({
  __esModule: true,
  default: () => <div>Global404</div>,
}))

describe('app root pages', () => {
  beforeEach(() => {
    mockRedirect.mockClear()
  })

  it('RootLayout returns children directly', async () => {
    const { default: RootLayout } = await import('../layout')
    const result = await RootLayout({ children: <div>Child</div> })

    render(<>{result}</>)
    expect(screen.getByText('Child')).toBeInTheDocument()
  })

  it('RootPage redirects to default locale', async () => {
    const { default: RootPage } = await import('../page')

    RootPage()

    expect(mockRedirect).toHaveBeenCalledWith('vi')
  })

  it('app not-found re-exports full page 404', async () => {
    const module = await import('../not-found')
    expect(module.default).toBeDefined()
  })
})
