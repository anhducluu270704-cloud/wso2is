
import React from 'react'
import { render, screen } from '@testing-library/react'
import { CardSkeleton } from '../card'

jest.mock('@/share/ui/card', () => ({
  Card: ({ children, className }: any) => <div data-testid="card" className={className}>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}))
jest.mock('@/share/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}))

describe('share/components/skeleton/card', () => {
  it('render CardSkeleton', () => {
    render(<CardSkeleton />)
    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })
})
