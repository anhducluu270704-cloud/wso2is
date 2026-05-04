
import React from 'react'
import { render, screen } from '@testing-library/react'

import CallbackLayout from '../layout'

describe('app/[locale]/callback/layout', () => {
  it('passes through children', () => {
    render(
      <CallbackLayout>
        <div>callback-child</div>
      </CallbackLayout>,
    )

    expect(screen.getByText('callback-child')).toBeInTheDocument()
  })
})
