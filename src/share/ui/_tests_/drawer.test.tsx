
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerOverlay,
  DrawerPortal,
  DrawerClose,
} from '@/share/ui/drawer'

jest.mock('vaul', () => ({
  Drawer: {
    Root: ({ children }: { children: React.ReactNode }) => <div data-slot="drawer">{children}</div>,
    Trigger: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Overlay: ({ className }: { className?: string }) => <div data-testid="drawer-overlay" className={className} />,
    Content: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-slot="drawer-content" className={className}>{children}</div>
    ),
    Close: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
    Title: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <h2 data-slot="drawer-title" className={className}>{children}</h2>
    ),
    Description: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <p data-slot="drawer-description" className={className}>{children}</p>
    ),
  },
}))

describe('share/ui/drawer', () => {
  it('render Drawer', () => {
    render(<Drawer><span>Content</span></Drawer>)
    expect(document.querySelector('[data-slot="drawer"]')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  it('render DrawerTrigger', () => {
    render(<Drawer><DrawerTrigger>Open</DrawerTrigger></Drawer>)
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })
  it('render DrawerContent với Header, Footer, Title, Description', () => {
    render(
      <Drawer>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
            <DrawerDescription>Description</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>Footer</DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
    expect(document.querySelector('[data-slot="drawer-content"]')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
  it('render DrawerOverlay', () => {
    render(
      <Drawer>
        <DrawerPortal>
          <DrawerOverlay className="overlay" />
        </DrawerPortal>
      </Drawer>
    )
    expect(screen.getByTestId('drawer-overlay')).toHaveClass('overlay')
  })
  it('render DrawerClose', () => {
    render(<Drawer><DrawerClose>Close</DrawerClose></Drawer>)
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})
