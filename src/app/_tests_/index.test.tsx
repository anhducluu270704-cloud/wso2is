
import React from 'react'
import { render, screen } from '@testing-library/react'

describe('RootLayout', () => {
  it('renders children directly', async () => {
    const { default: RootLayout } = await import('../layout')

    const element = await RootLayout({
      children: <div>Root children</div>,
    })

    render(element)

    expect(screen.getByText('Root children')).toBeInTheDocument()
  })
})

