
import React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from '../index'

const mockPush = jest.fn()
const mockCreateObjectURL = jest.fn(() => 'https://thumb.url')
const mockRevokeObjectURL = jest.fn()

beforeAll(() => {
  global.URL.createObjectURL = mockCreateObjectURL
  global.URL.revokeObjectURL = mockRevokeObjectURL
})

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))
jest.mock('next-intl', () => ({
  useTranslations: () => (k: string, opts?: { count?: number }) =>
    opts?.count != null ? `${k}:${opts.count}` : k,
}))
const mockUseGetApiProductThumbnail = jest.fn()
jest.mock('@/services/api-product/apiProduct.query-options', () => ({
  useGetApiProductThumbnail: (id: string) => mockUseGetApiProductThumbnail(id),
}))
jest.mock('next/image', () => ({
  __esModule: true,
  default: (p: { alt: string; src?: string; onError?: () => void }) => (
    <img
      alt={p.alt}
      src={p.src}
      onError={p.onError}
      data-testid="product-img"
    />
  ),
}))
jest.mock('lucide-react', () => ({ Layers: () => <span>Layers</span> }))
jest.mock('@/share/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}))
jest.mock('@/share/ui/card', () => ({
  Card: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => (
    <div data-testid="card" onClick={onClick}>
      {children}
    </div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

describe('api-product/card', () => {
  beforeEach(() => {
    mockUseGetApiProductThumbnail.mockReturnValue({ data: null })
  })

  it('render ProductCard với product', () => {
    const product = {
      id: '1',
      name: 'PayAPI',
      displayName: 'Payment API',
      description: 'Desc',
      context: '/v1',
      version: '1.0',
      type: 'APIPRODUCT',
    } as any
    render(<ProductCard product={product} />)
    expect(screen.getByTestId('card')).toBeInTheDocument()
  })

  it('click Card gọi router.push', async () => {
    const product = {
      id: '99',
      name: 'Z',
      displayName: 'Z API',
      description: 'D',
      context: '/v1',
      version: '1',
      type: 'APIPRODUCT',
    } as any
    render(<ProductCard product={product} />)
    await userEvent.click(screen.getByTestId('card'))
    expect(mockPush).toHaveBeenCalledWith('/api-products/99')
  })

  it('render thumbnail khi có data và gọi onError khi lỗi', () => {
    mockUseGetApiProductThumbnail.mockReturnValue({ data: new Blob() })
    const product = {
      id: '2',
      name: 'X',
      displayName: 'X API',
      description: 'D',
      context: '/v1',
      version: '1',
      type: 'APIPRODUCT',
    } as any
    render(<ProductCard product={product} />)
    const img = screen.getByTestId('product-img')
    expect(img).toHaveAttribute('src', 'https://thumb.url')
    expect(img).toHaveAttribute('alt', 'X')
    act(() => {
      img.dispatchEvent(new Event('error', { bubbles: true }))
    })
    expect(screen.getByTestId('card')).toBeInTheDocument()
  })

  it('render Badge khi resourceCount > 0', () => {
    const product = {
      id: '3',
      name: 'Y',
      displayName: 'Y API',
      description: 'D',
      context: '/v1',
      version: '1',
      type: 'APIPRODUCT',
      resourceCount: 5,
    } as any
    render(<ProductCard product={product} />)
    expect(screen.getByText(/card\.api_count:5/)).toBeInTheDocument()
  })

  it('không render image khi không có thumbnail; badge vẫn hiển thị kể cả resourceCount 0', () => {
    const product = {
      id: '4',
      name: 'No assets',
      displayName: 'No Assets API',
      description: 'D',
      context: '/v1',
      version: '1',
      type: 'APIPRODUCT',
      resourceCount: 0,
    } as any

    render(<ProductCard product={product} />)

    expect(screen.queryByTestId('product-img')).not.toBeInTheDocument()
    expect(screen.getByText(/card\.api_count:0/)).toBeInTheDocument()
  })
})
