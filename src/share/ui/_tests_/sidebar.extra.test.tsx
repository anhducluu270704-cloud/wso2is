
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import {
  RenderSidebarSubItem,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
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

jest.mock('radix-ui', () => ({
  Slot: {
    Root: ({ children, ...props }: any) =>
      React.cloneElement(React.Children.only(children), props),
  },
}))

jest.mock('@/share/hooks/use-mobile', () => ({
  useIsMobile: jest.fn(),
}))

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: LinkProps) => <a href={href}>{children}</a>,
  usePathname: jest.fn(),
}))

jest.mock('@/share/ui/sheet', () => ({
  Sheet: ({
    children,
    open,
    onOpenChange: _onOpenChange,
    ...props
  }: ChildrenProps & { open?: boolean; onOpenChange?: (open: boolean) => void }) => (
    <div data-testid="sheet" data-open={String(open)} {...props}>
      {children}
    </div>
  ),
  SheetContent: ({ children, ...props }: DivProps) => <div {...props}>{children}</div>,
  SheetHeader: ({ children, ...props }: DivProps) => <div {...props}>{children}</div>,
  SheetTitle: ({ children, ...props }: DivProps) => <div {...props}>{children}</div>,
  SheetDescription: ({ children, ...props }: DivProps) => <div {...props}>{children}</div>,
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

function renderWithSidebarProvider(children: React.ReactNode, props?: React.ComponentProps<typeof SidebarProvider>) {
  return render(<SidebarProvider {...props}>{children}</SidebarProvider>)
}

function SidebarStateProbe() {
  const { state, open, openMobile } = useSidebar()
  return (
    <div>
      <span>{state}</span>
      <span>{String(open)}</span>
      <span>{String(openMobile)}</span>
    </div>
  )
}

describe('share/ui/sidebar extra coverage', () => {
  beforeEach(() => {
    useIsMobile.mockReturnValue(false)
    usePathname.mockReturnValue('/settings/profile')
  })

  it('throws when hook is used outside provider', () => {
    expect(() => render(<SidebarTrigger />)).toThrow(
      'useSidebar must be used within a SidebarProvider.'
    )
  })

  it('handles desktop toggle actions and keyboard shortcut', () => {
    const onOpenChange = jest.fn()

    renderWithSidebarProvider(
      <>
        <SidebarStateProbe />
        <SidebarTrigger />
        <SidebarRail />
        <Sidebar variant="floating" collapsible="icon" side="right">
          Desktop sidebar
        </Sidebar>
        <SidebarInset>Inset content</SidebarInset>
      </>,
      { open: false, onOpenChange }
    )

    fireEvent.click(document.querySelector('[data-sidebar="trigger"]')!)
    fireEvent.click(document.querySelector('[data-sidebar="rail"]')!)
    fireEvent.keyDown(window, { key: 'b', metaKey: true })

    expect(onOpenChange).toHaveBeenCalledTimes(3)
    expect(document.querySelector('[data-slot="sidebar"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="sidebar-inset"]')).toBeInTheDocument()
  })

  it('renders mobile sidebar through sheet branch', () => {
    useIsMobile.mockReturnValue(true)

    renderWithSidebarProvider(
      <>
        <SidebarTrigger />
        <Sidebar>Mobile sidebar</Sidebar>
      </>
    )

    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByTestId('sheet')).toHaveAttribute('data-open', 'true')
    expect(document.querySelector('[data-mobile="true"]')).toBeInTheDocument()
    expect(screen.getByText('Sidebar')).toBeInTheDocument()
    expect(screen.getByText('Displays the mobile sidebar.')).toBeInTheDocument()
  })

  it('covers desktop Sidebar variants and collapsible attributes', () => {
    renderWithSidebarProvider(
      <Sidebar variant="inset" collapsible="offcanvas" side="left">
        Desktop
      </Sidebar>,
      { open: false }
    )

    const sidebarRoot = document.querySelector('[data-slot="sidebar"]')!
    expect(sidebarRoot).toHaveAttribute('data-state', 'collapsed')
    expect(sidebarRoot).toHaveAttribute('data-collapsible', 'offcanvas')

    const gap = document.querySelector('[data-slot="sidebar-gap"]') as HTMLElement
    const container = document.querySelector(
      '[data-slot="sidebar-container"]'
    ) as HTMLElement
    expect(gap).toBeInTheDocument()
    expect(container).toBeInTheDocument()
    expect(container.className).toContain('p-2')
  })

  it('does not set data-collapsible when expanded', () => {
    renderWithSidebarProvider(
      <Sidebar variant="sidebar" collapsible="icon" side="right">
        Desktop
      </Sidebar>,
      { open: true }
    )
    const sidebarRoot = document.querySelector('[data-slot="sidebar"]')!
    expect(sidebarRoot).toHaveAttribute('data-state', 'expanded')
    expect(sidebarRoot).toHaveAttribute('data-collapsible', '')
  })

  it('renders sidebar leaf components and tooltip variants', () => {
    renderWithSidebarProvider(
      <>
        <Sidebar collapsible="none">Static sidebar</Sidebar>
        <SidebarHeader>Header</SidebarHeader>
        <SidebarInput placeholder="Search sidebar" />
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <span>Group label</span>
            </SidebarGroupLabel>
            <SidebarGroupAction asChild>
              <button type="button">Group action</button>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <span>Settings</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction showOnHover>Action</SidebarMenuAction>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip={{ children: 'Object tooltip' }}>
                    <span>Object item</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <a href="/docs">Docs</a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
      </>,
      { open: false }
    )

    expect(screen.getByText('Static sidebar')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search sidebar')).toBeInTheDocument()
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByText('Object tooltip')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'href',
      '/docs'
    )
    expect(
      document.querySelector('[data-sidebar="menu-skeleton-icon"]')
    ).toBeInTheDocument()
  })

  it('covers SidebarMenuButton tooltip hidden logic', () => {
    // expanded => tooltip hidden
    renderWithSidebarProvider(
      <SidebarMenuButton tooltip="Tip">
        <span>Has tip</span>
      </SidebarMenuButton>,
      { open: true }
    )
    expect(screen.getByText('Tip')).toHaveAttribute('hidden')
  })

  it('covers SidebarMenuButton asChild branch', () => {
    renderWithSidebarProvider(
      <SidebarMenuButton asChild>
        <a href="/x">Child link</a>
      </SidebarMenuButton>
    )
    expect(screen.getByRole('link', { name: 'Child link' })).toHaveAttribute(
      'href',
      '/x'
    )
  })

  it('covers SidebarMenuAction asChild branch', () => {
    renderWithSidebarProvider(
      <SidebarMenuItem>
        <SidebarMenuButton>
          <span>Item</span>
        </SidebarMenuButton>
        <SidebarMenuAction asChild>
          <button type="button">Act</button>
        </SidebarMenuAction>
      </SidebarMenuItem>
    )
    expect(screen.getByRole('button', { name: 'Act' })).toBeInTheDocument()
  })

  it('covers SidebarGroupLabel/Action default element branch', () => {
    renderWithSidebarProvider(
      <SidebarGroup>
        <SidebarGroupLabel>Lbl</SidebarGroupLabel>
        <SidebarGroupAction>GA</SidebarGroupAction>
      </SidebarGroup>
    )
    expect(screen.getByText('Lbl')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'GA' })).toBeInTheDocument()
  })

  it('covers default menu action, skeleton and sub button branches', () => {
    renderWithSidebarProvider(
      <>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <span>Plain item</span>
            </SidebarMenuButton>
            <SidebarMenuAction>More action</SidebarMenuAction>
            <SidebarMenuBadge>1</SidebarMenuBadge>
          </SidebarMenuItem>
          <SidebarMenuSkeleton />
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton href="/plain-sub">
                <span>Plain sub item</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </SidebarMenu>
      </>
    )

    expect(screen.getByRole('button', { name: 'Plain item' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'More action' })).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(
      document.querySelector('[data-sidebar="menu-skeleton-icon"]')
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Plain sub item' })).toHaveAttribute(
      'href',
      '/plain-sub'
    )
    expect(document.querySelector('[data-slot="sidebar-menu-sub-button"]')).toHaveAttribute(
      'data-size',
      'md'
    )
  })

  it('covers SidebarMenuSubButton size=sm branch', () => {
    renderWithSidebarProvider(
      <SidebarMenuSubButton href="/sm" size="sm">
        <span>Sm</span>
      </SidebarMenuSubButton>
    )
    expect(document.querySelector('[data-slot="sidebar-menu-sub-button"]')).toHaveAttribute(
      'data-size',
      'sm'
    )
  })

  it('renders nested sub items and active state', () => {
    renderWithSidebarProvider(
      <RenderSidebarSubItem
        item={{
          title: 'Settings',
          url: '/settings',
          icon: () => <svg data-testid="settings-icon" />,
          items: [
            { title: 'Profile', url: '/settings/profile' },
            { title: 'Security', url: '/settings/security' },
          ],
        }}
      />
    )

    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute(
      'href',
      '/settings/profile'
    )
    expect(screen.getByTestId('chevron-right')).toBeInTheDocument()
  })
})
