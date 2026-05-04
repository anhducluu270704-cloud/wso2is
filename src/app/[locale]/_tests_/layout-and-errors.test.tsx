
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

const mockNotFound = jest.fn()
const mockSetRequestLocale = jest.fn()

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

jest.mock('next-intl', () => {
  const translator = ((key: string) => key) as ((key: string) => string) & {
    rich: (
      key: string,
      values: {
        p: (chunks: React.ReactNode) => React.ReactNode
        retry: (chunks: React.ReactNode) => React.ReactNode
      }
    ) => React.ReactNode
  }
  translator.rich = (_key, values) => (
    <>
      {values.p('paragraph')}
      {values.retry('retry')}
    </>
  )

  return {
    hasLocale: (locales: string[], locale: string) => locales.includes(locale),
    NextIntlClientProvider: ({
      children,
    }: {
      children: React.ReactNode
    }) => <div data-testid="intl-provider">{children}</div>,
    useTranslations: () => translator,
  }
})

jest.mock('next-intl/server', () => ({
  setRequestLocale: (locale: string) => mockSetRequestLocale(locale),
  getTranslations: async () => (key: string) => `translated:${key}`,
}))

jest.mock('next/font/google', () => ({
  Geist_Mono: () => ({ variable: 'geist-mono' }),
}))

jest.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['vi', 'en'],
  },
}))

jest.mock('@/providers/auth-provider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}))

jest.mock('@/providers/query-client-provider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-provider">{children}</div>
  ),
}))

jest.mock('@/share/ui/sonner', () => ({
  Toaster: () => <div>Toaster</div>,
}))

jest.mock('@/share/ui/empty', () => ({
  Empty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/share/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}))

jest.mock('@/share/components/full-page/error-layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/share/icons', () => ({
  Error404: () => <div>Error404Icon</div>,
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('app locale layout and errors', () => {
  beforeEach(() => {
    mockNotFound.mockClear()
    mockSetRequestLocale.mockClear()
  })

  it('generateStaticParams and metadata work', async () => {
    const module = await import('../layout')

    expect(module.generateStaticParams()).toEqual([{ locale: 'vi' }, { locale: 'en' }])
    await expect(module.metadata).toMatchObject({
      title: expect.objectContaining({ default: 'TECHCOMBANK_OPEN_API' }),
    })
  })

  it('LocaleLayout renders providers for valid locale', async () => {
    const { default: LocaleLayout } = await import('../layout')
    const result = await LocaleLayout({
      children: <div>Locale child</div>,
      params: Promise.resolve({ locale: 'vi' }),
    } as any)

    expect(mockSetRequestLocale).toHaveBeenCalledWith('vi')
    expect(React.isValidElement(result)).toBe(true)
    expect((result as React.ReactElement).props.lang).toBe('vi')
  })

  it('LocaleLayout calls notFound for invalid locale', async () => {
    const { default: LocaleLayout } = await import('../layout')
    const result = await LocaleLayout({
      children: <div>Locale child</div>,
      params: Promise.resolve({ locale: 'jp' }),
    } as any)

    expect(mockNotFound).toHaveBeenCalled()
    expect(React.isValidElement(result)).toBe(true)
  })

  it('locale not-found re-exports full page 404', async () => {
    const module = await import('../not-found')
    expect(module.default).toBeDefined()
  })

  it('error page logs error and calls reset', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const reset = jest.fn()
    const { default: ErrorPage } = await import('../error')

    render(<ErrorPage error={new Error('boom')} reset={reset} />)

    expect(screen.getByText('error.title')).toBeInTheDocument()
    fireEvent.click(screen.getByText('retry'))
    expect(reset).toHaveBeenCalled()
    expect(screen.getByText('btn.got_it')).toBeInTheDocument()

    spy.mockRestore()
  })
})
