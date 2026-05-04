
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/share/ui/navigation-menu'

jest.mock('radix-ui', () => ({
  NavigationMenu: {
    Root: ({ children, className, ...props }: any) => (
      <nav className={className} {...props}>
        {children}
      </nav>
    ),
    List: ({ children, className, ...props }: any) => (
      <ul className={className} {...props}>
        {children}
      </ul>
    ),
    Item: ({ children, className, ...props }: any) => (
      <li className={className} {...props}>
        {children}
      </li>
    ),
    Trigger: ({ children, className, ...props }: any) => (
      <button className={className} {...props}>
        {children}
      </button>
    ),
    Content: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    Viewport: ({ className, ...props }: any) => <div className={className} {...props} />,
    Link: ({ children, className, ...props }: any) => (
      <a className={className} {...props}>
        {children}
      </a>
    ),
    Indicator: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}))

jest.mock('lucide-react', () => ({
  ChevronDownIcon: () => <span data-testid="chevron-down-icon" />,
}))

describe('share/ui/navigation-menu', () => {
  it('render navigation menu với viewport mặc định', () => {
    render(
      <NavigationMenu className="custom-menu">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent className="custom-content">
              <NavigationMenuLink href="/docs" data-active>
                Docs
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuIndicator className="custom-indicator" />
      </NavigationMenu>
    )

    expect(document.querySelector('[data-slot="navigation-menu"]')).toHaveClass('custom-menu')
    expect(screen.getByRole('button', { name: 'Products' })).toBeInTheDocument()
    expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('data-active', 'true')
    expect(document.querySelector('[data-slot="navigation-menu-viewport"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="navigation-menu-indicator"]')).toHaveClass(
      'custom-indicator'
    )
  })

  it('render navigation menu khi tắt viewport', () => {
    render(
      <>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/about">About</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenuViewport className="manual-viewport" />
      </>
    )

    expect(document.querySelector('[data-slot="navigation-menu"]')).toHaveAttribute(
      'data-viewport',
      'false'
    )
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
    expect(document.querySelector('.manual-viewport')).toBeInTheDocument()
  })

  it('trả class từ navigationMenuTriggerStyle', () => {
    expect(navigationMenuTriggerStyle()).toContain('group/navigation-menu-trigger')
  })
})
