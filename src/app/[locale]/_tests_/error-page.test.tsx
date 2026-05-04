
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

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
    useTranslations: () => translator,
  }
})

jest.mock('@/share/ui/empty', () => ({
  Empty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  EmptyContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  EmptyTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  EmptyDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

jest.mock('@/share/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}))

jest.mock('@/share/components/full-page/error-layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
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

describe('Locale error page', () => {
  it('logs error, renders texts and calls reset when retry clicked', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const reset = jest.fn()
    const { default: ErrorPage } = await import('../error')

    render(<ErrorPage error={new Error('boom')} reset={reset} />)


    // title from useTranslations
    expect(screen.getByText('error.title')).toBeInTheDocument()

    // rich translation renders retry button that triggers reset
    fireEvent.click(screen.getByText('retry'))
    expect(reset).toHaveBeenCalledTimes(1)

    // "got it" button link is rendered
    expect(screen.getByText('btn.got_it')).toBeInTheDocument()

    spy.mockRestore()
  })
})

