
import React from 'react'
import { render, screen } from '@testing-library/react'
import ContainerFormBody from '../index'

describe('share/components/form', () => {
  it('render ContainerFormBody với children', () => {
    render(
      <ContainerFormBody>
        <button type="submit">Submit</button>
      </ContainerFormBody>
    )
    const form = document.querySelector('form')
    expect(form).toBeInTheDocument()
    expect(form).toHaveClass('flex', 'flex-col', 'gap-6')
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('render form với props spread', () => {
    render(
      <ContainerFormBody action="/api" method="post" data-testid="form">
        <span>Content</span>
      </ContainerFormBody>
    )
    const form = screen.getByTestId('form')
    expect(form).toHaveAttribute('action', '/api')
    expect(form).toHaveAttribute('method', 'post')
  })
})
