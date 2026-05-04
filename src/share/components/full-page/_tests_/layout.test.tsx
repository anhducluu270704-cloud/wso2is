
import React from 'react'
import { render, screen } from '@testing-library/react'
import FullPageLayout from '../full-layout'

describe('full-page/layout', () => {
  it('render FullPageLayout với children', () => {
    render(
      <FullPageLayout>
        <span>Page content</span>
      </FullPageLayout>
    )
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })
})
