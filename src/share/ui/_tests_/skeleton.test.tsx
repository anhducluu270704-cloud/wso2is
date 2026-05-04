
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/share/ui/skeleton'

describe('share/ui/skeleton', () => {
  it('render Skeleton', () => {
    const { container } = render(<Skeleton className="h-4 w-20" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})