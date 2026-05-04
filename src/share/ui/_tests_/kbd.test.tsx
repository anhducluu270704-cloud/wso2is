
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Kbd, KbdGroup } from '@/share/ui/kbd'

describe('share/ui/kbd', () => {
  it('render Kbd với text', () => {
    render(<Kbd>Enter</Kbd>)
    expect(screen.getByText('Enter')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="kbd"]')).toBeInTheDocument()
  })
  it('render Kbd với className', () => {
    render(<Kbd className="custom-kbd">Ctrl</Kbd>)
    expect(document.querySelector('.custom-kbd')).toBeInTheDocument()
  })
  it('render KbdGroup', () => {
    render(
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>C</Kbd>
      </KbdGroup>
    )
    expect(document.querySelector('[data-slot="kbd-group"]')).toBeInTheDocument()
    expect(screen.getByText('Ctrl')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })
})
