
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogClose,
  DialogPortal,
} from '@/share/ui/dialog'

jest.mock('radix-ui', () => ({
  Dialog: {
    Root: ({ children, open }: { children: React.ReactNode; open?: boolean }) =>
      open ? <div data-testid="dialog-root">{children}</div> : null,
    Trigger: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
    Portal: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-portal">{children}</div>,
    Overlay: ({ className }: { className?: string }) => <div data-testid="dialog-overlay" className={className} />,
    Content: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-testid="dialog-content" className={className}>{children}</div>
    ),
    Close: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) =>
      asChild ? <>{children}</> : <button type="button">{children}</button>,
    Title: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <h2 data-testid="dialog-title" className={className}>{children}</h2>
    ),
    Description: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <p data-testid="dialog-description" className={className}>{children}</p>
    ),
  },
}))
jest.mock('lucide-react', () => ({ XIcon: () => <span data-testid="x-icon" /> }))
jest.mock('@/share/ui/button', () => ({
  Button: ({
    children,
    rounded: _rounded,
    variant: _variant,
    size: _size,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode
    rounded?: boolean
    variant?: string
    size?: string
  }) => <button type="button" {...props}>{children}</button>,
}))

describe('share/ui/dialog', () => {
  it('render Dialog open với children', () => {
    render(<Dialog open><span>Content</span></Dialog>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  it('render DialogTrigger', () => {
    render(
      <Dialog open>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>
    )
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })
  it('render DialogContent với children và showCloseButton', () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton>
          <span>Dialog body</span>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Dialog body')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
  })
  it('render DialogContent showCloseButton=false', () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>Body</DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
  it('render DialogContent dùng default showCloseButton', () => {
    render(
      <Dialog open>
        <DialogContent>Default close</DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Default close')).toBeInTheDocument()
    expect(screen.getByTestId('x-icon')).toBeInTheDocument()
  })
  it('render DialogHeader, DialogTitle, DialogDescription', () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description text</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Title')
    expect(screen.getByTestId('dialog-description')).toHaveTextContent('Description text')
  })
  it('render DialogFooter với showCloseButton và cancelTitle', () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogFooter showCloseButton cancelTitle="Cancel">
            <button type="button">Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })
  it('render DialogFooter không showCloseButton', () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogFooter>
            <button type="button">OK</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
  })
  it('render DialogOverlay với className', () => {
    render(
      <Dialog open>
        <DialogPortal>
          <DialogOverlay className="custom-overlay" />
        </DialogPortal>
      </Dialog>
    )
    expect(screen.getByTestId('dialog-overlay')).toHaveClass('custom-overlay')
  })
  it('render DialogClose', () => {
    render(
      <Dialog open>
        <DialogClose>Close</DialogClose>
      </Dialog>
    )
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})