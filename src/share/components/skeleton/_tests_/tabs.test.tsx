import React from 'react'
import { render, screen } from '@testing-library/react'
import { TabsSkeleton } from '../tabs'

jest.mock('@/share/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => <div data-testid="skeleton" className={className} />,
}))

describe('share/components/skeleton/tabs', () => {
  it('renders two skeleton blocks for tabs layout', () => {
    render(<TabsSkeleton />)
    expect(screen.getAllByTestId('skeleton')).toHaveLength(2)
  })
})
