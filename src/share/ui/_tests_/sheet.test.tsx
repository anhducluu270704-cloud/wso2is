
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/share/ui/sheet'

jest.mock('radix-ui', () => ({
  Dialog: {
    Root: ({ children, ...p }: any) => <div data-slot="sheet" {...p}>{children}</div>,
    Trigger: ({ children, ...p }: any) => <div data-slot="sheet-trigger" {...p}>{children}</div>,
    Portal: ({ children, ...p }: any) => <div data-slot="sheet-portal" {...p}>{children}</div>,
    Overlay: ({ ...p }: any) => <div data-slot="sheet-overlay" {...p} />,
    Close: ({ children, asChild, ...p }: any) =>
      asChild ? React.cloneElement(children, p) : <button type="button" data-slot="sheet-close" {...p}>{children}</button>,
    Content: ({ children, ...p }: any) => <div data-slot="sheet-content" {...p}>{children}</div>,
    Title: ({ children, ...p }: any) => <h2 data-slot="sheet-title" {...p}>{children}</h2>,
    Description: ({ children, ...p }: any) => <p data-slot="sheet-description" {...p}>{children}</p>,
  },
}))
jest.mock('lucide-react', () => ({ XIcon: () => null }))
jest.mock('@/share/ui/button', () => ({ Button: ({ children }: any) => <button>{children}</button> }))

describe('share/ui/sheet', () => {
  it('render Sheet với trigger và content', () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>Content</SheetContent>
      </Sheet>
    )
    expect(document.querySelector('[data-slot="sheet"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="sheet-trigger"]')).toBeInTheDocument()
  })

  it('render đầy đủ header footer title description và close', () => {
    render(
      <Sheet>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Sheet title</SheetTitle>
            <SheetDescription>Sheet description</SheetDescription>
          </SheetHeader>
          <SheetFooter>Footer</SheetFooter>
          <SheetClose>Close</SheetClose>
        </SheetContent>
      </Sheet>
    )

    expect(document.querySelector('[data-slot="sheet-portal"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="sheet-overlay"]')).toBeInTheDocument()
    expect(screen.getByText('Sheet title')).toBeInTheDocument()
    expect(screen.getByText('Sheet description')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="sheet-close"]')).toBeInTheDocument()
  })

  it('ẩn close button khi showCloseButton=false', () => {
    render(
      <Sheet>
        <SheetContent showCloseButton={false}>No close</SheetContent>
      </Sheet>
    )

    expect(screen.getByText('No close')).toBeInTheDocument()
    expect(screen.queryByText('Close')).not.toBeInTheDocument()
  })
})