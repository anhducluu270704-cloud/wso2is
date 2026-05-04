import React from 'react'
import { render, screen } from '@testing-library/react'
import Alert from '../index'

jest.mock('@/share/icons', () => ({
  AlertErrorIcon: ({ className }: { className?: string }) => <span data-testid="alert-error-icon" className={className} />,
  AlertInfo: ({ className }: { className?: string }) => <span data-testid="alert-info-icon" className={className} />,
}))

describe('share/components/alert', () => {
  it('renders error alert with title and description', () => {
    render(<Alert type="error" title="Error" description="Something happened" />)
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Something happened')).toBeInTheDocument()
    expect(screen.getByTestId('alert-error-icon')).toBeInTheDocument()
  })

  it('renders info alert and fallback branch (warning)', () => {
    const { rerender } = render(<Alert type="info" description="Info" />)
    expect(screen.getByTestId('alert-info-icon')).toBeInTheDocument()

    rerender(<Alert type="warning" description="Warn" />)
    expect(screen.getByText('Warn')).toBeInTheDocument()
    expect(screen.getByTestId('alert-info-icon')).toBeInTheDocument()
  })
})
