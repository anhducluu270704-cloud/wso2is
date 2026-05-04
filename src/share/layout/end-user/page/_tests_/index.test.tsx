
import React from 'react'
import { render, screen } from '@testing-library/react'
import EUPageLayout from '../index'

const mockUsePathname = jest.fn()
const mockTranslate = Object.assign((key: string) => `translated:${key}`, {
  has: (key: string) => key === 'home' || key === 'apiproducts',
})

jest.mock('@/i18n/navigation', () => ({ usePathname: () => mockUsePathname() }))
jest.mock('next-intl', () => ({ useTranslations: () => mockTranslate }))
jest.mock('@/share/ui/breadcrumb', () => ({
  Breadcrumb: ({ children }: any) => <nav>{children}</nav>,
  BreadcrumbItem: ({ children }: any) => <span>{children}</span>,
  BreadcrumbList: ({ children }: any) => <span>{children}</span>,
  BreadcrumbPage: ({ children }: any) => <span>{children}</span>,
  BreadcrumbSeparator: () => null,
}))
jest.mock('../../header/items', () => ({
  EUHeaderItems: [
    { title: 'api', url: '/api' },
    { title: 'apiproducts', url: '/api-products' },
    { title: 'news', url: '/news' },
  ],
}))

describe('share/layout/end-user/page', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/api-products')
  })

  it('render EUPageLayout với title và children', () => {
    render(
      <EUPageLayout title="Page Title" headerImageSrc="/img.png">
        <span>Content</span>
      </EUPageLayout>
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Page Title')).toBeInTheDocument()
    expect(screen.getByText('translated:home')).toBeInTheDocument()
    expect(screen.getByText('translated:apiproducts')).toBeInTheDocument()
  })

  it('hiển thị description khi có', () => {
    render(
      <EUPageLayout title="T" description="Subtitle">
        <span>Content</span>
      </EUPageLayout>
    )
    expect(screen.getByText('Subtitle')).toBeInTheDocument()
  })

  it('lấy breadcrumb theo prefix path dài nhất khi không match exact', () => {
    mockUsePathname.mockReturnValue('/api-products/detail')

    render(
      <EUPageLayout title="T">
        <span>Content</span>
      </EUPageLayout>
    )

    expect(screen.getByText('translated:apiproducts')).toBeInTheDocument()
  })

  it('fallback rỗng khi không tìm thấy item phù hợp', () => {
    mockUsePathname.mockReturnValue('/unknown')

    const { container } = render(
      <EUPageLayout title="Unknown page">
        <span>Content</span>
      </EUPageLayout>
    )

    expect(screen.getByText('translated:home')).toBeInTheDocument()
    expect(container.querySelector('nav')).toBeInTheDocument()
  })
})