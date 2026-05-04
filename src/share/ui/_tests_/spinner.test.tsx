import React from 'react'
import { render, screen } from '@testing-library/react'
import { SpinnerCustom } from '@/share/ui/spinner'

jest.mock('@/share/icons', () => ({
  Loading: (props: Record<string, unknown>) => (
    <svg data-testid="loading-icon" {...props} />
  ),
}))

describe('share/ui/spinner', () => {
  it('render SpinnerCustom', () => {
    render(<SpinnerCustom />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })
})
