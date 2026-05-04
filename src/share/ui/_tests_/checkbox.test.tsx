
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '@/share/ui/checkbox'

jest.mock('radix-ui', () => ({
  Checkbox: {
    Root: ({ children, ...p }: any) => <button type="button" data-slot="checkbox" {...p}>{children}</button>,
    Indicator: () => <span data-slot="checkbox-indicator" />,
  },
}))
jest.mock('lucide-react', () => ({ CheckIcon: () => null }))

describe('share/ui/checkbox', () => {
  it('render Checkbox', () => {
    render(<Checkbox />)
    expect(document.querySelector('[data-slot="checkbox"]')).toBeInTheDocument()
  })
})
