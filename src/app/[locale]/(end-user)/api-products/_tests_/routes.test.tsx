
import React from 'react'
import { render, screen } from '@testing-library/react'
import { ITEMS_PER_PAGE } from '@/constants/api-product'

const mockGetTranslations = jest.fn()
const mockParseFilterSearchParams = jest.fn()
const mockNotFound = jest.fn()

jest.mock('next-intl/server', () => ({
  getTranslations: (...args: unknown[]) => mockGetTranslations(...args),
}))

jest.mock('@/util/filter', () => ({
  parseFilterSearchParams: (...args: unknown[]) => mockParseFilterSearchParams(...args),
}))

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

jest.mock('@/providers/filter-provider', () => ({
  FilterProvider: ({
    children,
    filter,
  }: {
    children: React.ReactNode
    filter: unknown
  }) => <div data-filter={JSON.stringify(filter)}>{children}</div>,
}))

jest.mock('@/components/api-product', () => ({
  __esModule: true,
  default: () => <div>ApiProductWrapper</div>,
}))

jest.mock('@/components/api-product/detail', () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => <div>ApiProductDetail:{id}</div>,
}))

jest.mock('@/components/application/create', () => ({
  __esModule: true,
  default: () => <div>CreateApplicationWrapper</div>,
}))

jest.mock('@/components/application/detail', () => ({
  __esModule: true,
  default: ({ app_id }: { app_id: string }) => (
    <div>ApplicationDetail:{app_id}</div>
  ),
}))
jest.mock('@/components/application/detail/overview', () => ({
  __esModule: true,
  default: () => <div>OverviewSection</div>,
}))
jest.mock('@/providers/auth-provider', () => ({
  useAuth: () => ({ isLoading: false, authInfo: {} }),
}))
jest.mock('@/share/layout/end-user/header/hook', () => ({
  useGetUrlLoginMutation: () => ({ mutate: () => {} }),
}))
jest.mock('next-intl', () => ({ useLocale: () => 'en' }))

describe('api-products routes', () => {
  beforeEach(() => {
    mockGetTranslations.mockReset()
    mockParseFilterSearchParams.mockReset()
    mockNotFound.mockClear()
    mockGetTranslations.mockResolvedValue((key: string) => `translated:${key}`)
    mockParseFilterSearchParams.mockReturnValue({
      data: { limit: 12, offset: 0 },
      error: null,
    })
  })

  it('api-products page metadata and render success', async () => {
    const module = await import('../page')

    await expect(module.generateMetadata()).resolves.toEqual({
      title: 'translated:header.apiproducts',
      description: '',
    })

    const result = await module.default({
      searchParams: Promise.resolve({ keyword: 'loan' }),
    } as any)

    render(<>{result}</>)

    expect(mockParseFilterSearchParams).toHaveBeenCalledWith({
      keyword: 'loan',
      limit: ITEMS_PER_PAGE,
    })
    expect(screen.getByText('ApiProductWrapper')).toBeInTheDocument()
  })

  it('api-products page renders invalid params state', async () => {
    mockParseFilterSearchParams.mockReturnValue({ data: null, error: new Error('bad') })
    const module = await import('../page')

    const result = await module.default({
      searchParams: Promise.resolve({}),
    } as any)

    render(<>{result}</>)

    expect(screen.getByText('Invalid Query Params')).toBeInTheDocument()
  })

  it('api-product detail page metadata and render wrapper', async () => {
    const module = await import('../[id]/page')

    await expect(module.generateMetadata()).resolves.toEqual({
      title: 'translated:header.apiproducts',
      description: '',
    })

    const result = await module.default({
      params: Promise.resolve({ id: 'api-1' }),
      searchParams: Promise.resolve({ showInlineToast: '' }),
    } as any)

    render(<>{result}</>)
    expect(screen.getByText('ApiProductDetail:api-1')).toBeInTheDocument()
  })

  it('application create page metadata and render', async () => {
    const module = await import('../[id]/application/create/page')

    await expect(module.generateMetadata()).resolves.toEqual({
      title: 'translated:header.application',
      description: '',
    })

    const result = await module.default({
      searchParams: Promise.resolve({ callback: '/en/api-products/api-1' }),
    } as any)
    render(<>{result}</>)
    expect(screen.getByText('CreateApplicationWrapper')).toBeInTheDocument()
  })

  it('application layout wraps children', async () => {
    const module = await import('../[id]/application/layout')
    const Layout = module.default
    render(
      <Layout>
        <div>Application child</div>
      </Layout>
    )
    expect(screen.getByText('Application child')).toBeInTheDocument()
  })

  it('application detail page metadata and render wrapper', async () => {
    const module = await import('../[id]/application/[app_id]/page')

    await expect(module.generateMetadata()).resolves.toEqual({
      title: 'translated:header.application',
      description: '',
    })

    const result = await module.default({
      params: Promise.resolve({ app_id: 'app-2' }),
      searchParams: Promise.resolve({
        api_product_name: 'api-1',
        active: 'overview',
      }),
    } as any)

    render(<>{result}</>)
    expect(screen.getByText('ApplicationDetail:app-2')).toBeInTheDocument()
  })

})
