
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogMedia,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/share/ui/alert-dialog'

jest.mock('radix-ui', () => ({
  AlertDialog: {
    Root: ({ children, open }: { children: React.ReactNode; open?: boolean }) =>
      open ? <div data-testid="alert-dialog-root">{children}</div> : null,
    Trigger: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Overlay: ({ className }: { className?: string }) => <div data-testid="alert-overlay" className={className} />,
    Content: ({ children, className, ...props }: React.ComponentProps<'div'> & { children: React.ReactNode }) => (
      <div data-testid="alert-content" className={className} {...props}>{children}</div>
    ),
    Title: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <h2 className={className}>{children}</h2>
    ),
    Description: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <p className={className}>{children}</p>
    ),
    Action: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <button type="button" className={className}>{children}</button>
    ),
    Cancel: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <button type="button" className={className}>{children}</button>
    ),
  },
}))
jest.mock('@/share/ui/button', () => ({
  Button: ({ children, asChild, ...p }: any) =>
    asChild ? <>{children}</> : <button type="button" {...p}>{children}</button>,
}))

describe('share/ui/alert-dialog', () => {
  it('render AlertDialog open', () => {
    render(<AlertDialog open><span>Content</span></AlertDialog>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  it('render AlertDialogTrigger', () => {
    render(<AlertDialog open><AlertDialogTrigger>Open</AlertDialogTrigger></AlertDialog>)
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })
  it('render AlertDialogContent với size default và sm', () => {
    const { rerender } = render(
      <AlertDialog open>
        <AlertDialogContent size="default">Body</AlertDialogContent>
      </AlertDialog>
    )
    expect(document.querySelector('[data-size="default"]')).toBeInTheDocument()
    rerender(
      <AlertDialog open>
        <AlertDialogContent size="sm">Body</AlertDialogContent>
      </AlertDialog>
    )
    expect(document.querySelector('[data-size="sm"]')).toBeInTheDocument()
  })
  it('render AlertDialogHeader, Title, Description', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
            <AlertDialogDescription>Are you sure?</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    )
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })
  it('render AlertDialogFooter, Action, Cancel', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })
  it('render AlertDialogOverlay', () => {
    render(
      <AlertDialog open>
        <AlertDialogPortal>
          <AlertDialogOverlay className="overlay" />
        </AlertDialogPortal>
      </AlertDialog>
    )
    expect(screen.getByTestId('alert-overlay')).toHaveClass('overlay')
  })
  it('render AlertDialogMedia', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogMedia>Icon</AlertDialogMedia>
        </AlertDialogContent>
      </AlertDialog>
    )
    expect(document.querySelector('[data-slot="alert-dialog-media"]')).toHaveTextContent('Icon')
  })
})
