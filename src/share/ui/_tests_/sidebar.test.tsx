
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuButton,
  RenderSidebarSubItem,
  Sidebar,
} from '../sidebar'

type ChildrenProps = {
  children?: React.ReactNode
}

type LinkProps = ChildrenProps & {
  href?: string
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ChildrenProps
type DivProps = React.HTMLAttributes<HTMLDivElement> & ChildrenProps
type InputProps = React.InputHTMLAttributes<HTMLInputElement>
type HrProps = React.HTMLAttributes<HTMLHRElement>

jest.mock('@/share/hooks/use-mobile', () => ({
  useIsMobile: jest.fn(),
}))

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: LinkProps) => <a href={href}>{children}</a>,
  usePathname: jest.fn(),
}))

jest.mock('@/share/ui/sheet', () => ({
  Sheet: ({ children }: ChildrenProps) => <div data-testid="sheet">{children}</div>,
  SheetContent: ({ children }: ChildrenProps) => <div>{children}</div>,
  SheetHeader: ({ children }: ChildrenProps) => <div>{children}</div>,
  SheetTitle: ({ children }: ChildrenProps) => <div>{children}</div>,
  SheetDescription: ({ children }: ChildrenProps) => <div>{children}</div>,
}))

jest.mock('@/share/ui/button', () => ({
  Button: ({ children, ...props }: ButtonProps) => <button {...props}>{children}</button>,
}))

jest.mock('@/share/ui/input', () => ({
  Input: (props: InputProps) => <input {...props} />,
}))

jest.mock('@/share/ui/separator', () => ({
  Separator: (props: HrProps) => <hr {...props} />,
}))

jest.mock('@/share/ui/skeleton', () => ({
  Skeleton: (props: DivProps) => <div {...props} />,
}))

jest.mock('@/share/ui/tooltip', () => ({
  TooltipProvider: ({ children }: ChildrenProps) => <>{children}</>,
  Tooltip: ({ children }: ChildrenProps) => <>{children}</>,
  TooltipTrigger: ({ children }: ChildrenProps) => <>{children}</>,
  TooltipContent: ({ children, ...props }: DivProps) => <div {...props}>{children}</div>,
}))

jest.mock('../collapsible', () => ({
  Collapsible: ({ children }: ChildrenProps) => <div>{children}</div>,
  CollapsibleContent: ({ children }: ChildrenProps) => <div>{children}</div>,
  CollapsibleTrigger: ({ children }: ChildrenProps) => <>{children}</>,
}))

jest.mock('lucide-react', () => ({
  ChevronRight: () => <svg data-testid="chevron-right" />,
  PanelLeftIcon: () => <svg data-testid="panel-left-icon" />,
}))

const { useIsMobile } = jest.requireMock('@/share/hooks/use-mobile') as {
  useIsMobile: jest.Mock
}

const { usePathname } = jest.requireMock('@/i18n/navigation') as {
  usePathname: jest.Mock
}

function renderWithSidebarProvider(children: React.ReactNode) {
  return render(<SidebarProvider>{children}</SidebarProvider>)
}

describe('Sidebar UI', () => {
  beforeEach(() => {
    useIsMobile.mockReturnValue(false)
    usePathname.mockReturnValue('/settings/profile')
  })

  it('renders SidebarTrigger and toggles state on click', () => {
    renderWithSidebarProvider(<SidebarTrigger />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(button).toBeInTheDocument()
    expect(screen.getByText('Toggle Sidebar')).toBeInTheDocument()
  })

  it('renders SidebarMenuButton content', () => {
    renderWithSidebarProvider(
      <SidebarMenuButton>
        <span>Dashboard</span>
      </SidebarMenuButton>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders nested links in RenderSidebarSubItem', () => {
    renderWithSidebarProvider(
      <RenderSidebarSubItem
        item={{
          title: 'Settings',
          url: '/settings',
          icon: () => <svg data-testid="settings-icon" />,
          items: [{ title: 'Profile', url: '/settings/profile' }],
        }}
      />
    )

    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute(
      'href',
      '/settings/profile'
    )
  })

  it('renders Sidebar in non-collapsible mode', () => {
    renderWithSidebarProvider(
      <Sidebar collapsible="none">
        <span>Static sidebar</span>
      </Sidebar>
    )

    expect(screen.getByText('Static sidebar')).toBeInTheDocument()
  })

  it('renders mobile Sidebar and closes via onOpenChange', () => {
    useIsMobile.mockReturnValue(true)

    renderWithSidebarProvider(
      <Sidebar side="right">
        <span>Mobile sidebar</span>
      </Sidebar>
    )

    expect(screen.getByTestId('sheet')).toBeInTheDocument()
  })
})
