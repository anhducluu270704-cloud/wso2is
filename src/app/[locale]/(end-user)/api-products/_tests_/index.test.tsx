
import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('next-intl/server', () => ({
  getTranslations: (ns: string) => Promise.resolve((key: string) => `${ns}.${key}`),
}))

jest.mock('@/providers/filter-provider', () => ({
  FilterProvider: ({
    filter,
    children,
  }: {
    filter: unknown
    children: React.ReactNode
  }) => (
    <div data-testid="filter-provider" data-filter={JSON.stringify(filter)}>
      {children}
    </div>
  ),
}))

jest.mock('@/util/filter', () => ({
  parseFilterSearchParams: jest.fn(),
}))

jest.mock('@/components/api-product', () => ({
  __esModule: true,
  default: () => <div>ApiProductWrapper</div>,
}))

describe('ApiProductsPage module', () => {
  const { parseFilterSearchParams } = jest.requireMock('@/util/filter') as {
    parseFilterSearchParams: jest.Mock
  }

  beforeEach(() => {
    parseFilterSearchParams.mockReset()
  })

  it('generateMetadata uses layout translations', async () => {
    const { generateMetadata } = await import('../page')

    const metadata = await generateMetadata()
    expect(metadata.title).toBe('layout.header.apiproducts')
    expect(metadata.description).toBe('')
  })

  it('renders error text when parseFilterSearchParams has error', async () => {
    parseFilterSearchParams.mockReturnValue({ error: 'invalid', data: null })
    const { default: ApiProductsPage } = await import('../page')

    const element = await ApiProductsPage({
      searchParams: Promise.resolve({}),
    } as any)

    render(element)

    expect(
      screen.getByText('Invalid Query Params')
    ).toBeInTheDocument()
  })

  it('wraps ApiProductWrapper in FilterProvider when params valid', async () => {
    parseFilterSearchParams.mockReturnValue({
      error: null,
      data: { page: 1, limit: 10 },
    })
    const { default: ApiProductsPage } = await import('../page')

    const element = await ApiProductsPage({
      searchParams: Promise.resolve({ page: 2 }),
    } as any)

    render(element)

    const provider = screen.getByTestId('filter-provider')
    expect(provider).toBeInTheDocument()
    expect(provider.getAttribute('data-filter')).toBe(
      JSON.stringify({ page: 1, limit: 10 })
    )
    expect(screen.getByText('ApiProductWrapper')).toBeInTheDocument()
  })
})

