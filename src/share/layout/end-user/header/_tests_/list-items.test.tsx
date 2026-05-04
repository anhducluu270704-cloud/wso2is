
import React from 'react'
import { render, screen } from '@testing-library/react'
import { EUHeaderListItems } from '../list-items'

const mockUsePathname = jest.fn()

const KEYS_WITH_TRANSLATIONS = new Set([
  'apiproducts',
  'news',
  'support',
  'support_faqs',
  'support_guide',
])
const mockTranslate = Object.assign(
  (key: string) =>
    KEYS_WITH_TRANSLATIONS.has(key) ? `translated:${key}` : key,
  {
    has: (key: string) => KEYS_WITH_TRANSLATIONS.has(key),
  }
)

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
  usePathname: () => mockUsePathname(),
}))
jest.mock('next-intl', () => ({
  useTranslations: () => mockTranslate,
}))
jest.mock('@/share/icons', () => ({
  ChevronDown: () => <span data-testid="chevron-mock" />,
}))
jest.mock('@/share/ui/navigation-menu', () => ({
  NavigationMenu: ({ children }: any) => <nav>{children}</nav>,
  NavigationMenuList: ({ children }: any) => <ul>{children}</ul>,
  NavigationMenuItem: ({ children }: any) => <li>{children}</li>,
  NavigationMenuLink: ({ children, asChild, ...props }: any) => <span {...props}>{children}</span>,
  navigationMenuTriggerStyle: () => '',
}))
jest.mock('@/share/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="support-dropdown">{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <button type="button">{children}</button>,
  DropdownMenuContent: ({ children }: any) => <div role="menu">{children}</div>,
  DropdownMenuItem: ({ children, asChild }: any) =>
    asChild ? <div>{children}</div> : <div>{children}</div>,
}))

describe('share/layout/end-user/header/list-items', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/api-products/detail')
  })

  it('render EUHeaderListItems với item active và translation nếu có', () => {
    render(<EUHeaderListItems />)

    expect(screen.getByText('translated:apiproducts')).toBeInTheDocument()
    expect(screen.getByText('translated:news')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /translated:support/i })).toBeInTheDocument()
    expect(screen.getByText('translated:support')).toBeInTheDocument()
    expect(screen.getByText('translated:support_faqs')).toBeInTheDocument()
    expect(screen.getByText('translated:support_guide')).toBeInTheDocument()
    expect(screen.getByText('translated:apiproducts').closest('span')).toHaveAttribute(
      'data-active',
      'true'
    )
  })
})
