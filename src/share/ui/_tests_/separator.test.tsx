
import React from 'react'
import { render } from '@testing-library/react'
import { Separator } from '@/share/ui/separator'

jest.mock('radix-ui', () => ({
  Separator: {
    Root: ({
      decorative: _decorative,
      orientation,
      ...props
    }: React.ComponentProps<'div'> & {
      decorative?: boolean
      orientation?: 'horizontal' | 'vertical'
    }) => <div data-slot="separator" data-orientation={orientation} {...props} />,
  },
}))

describe('share/ui/separator', () => {
  it('render Separator', () => {
    const { container } = render(<Separator />)
    expect(container.querySelector('[data-slot="separator"]')).toBeInTheDocument()
  })
})