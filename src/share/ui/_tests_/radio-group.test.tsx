
import React from 'react'
import { render, screen } from '@testing-library/react'
import { RadioGroup, RadioGroupItem } from '@/share/ui/radio-group'

jest.mock('radix-ui', () => ({
  RadioGroup: {
    Root: ({ children, ...p }: any) => <div data-slot="radio-group" role="radiogroup" {...p}>{children}</div>,
    Item: ({ children, ...p }: any) => <div data-slot="radio-group-item" role="radio" {...p}>{children}</div>,
    Indicator: () => <span />,
  },
}))

describe('share/ui/radio-group', () => {
  it('render RadioGroup với item', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>
    )
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    expect(document.querySelectorAll('[data-slot="radio-group-item"]')).toHaveLength(2)
  })
})
