
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Textarea, textareaVariants } from '@/share/ui/textarea'

describe('share/ui/textarea', () => {
  it('render Textarea', () => {
    render(<Textarea placeholder="Enter text" />)
    expect(document.querySelector('textarea')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('render Textarea với variant, size và disabled', () => {
    render(
      <Textarea
        placeholder="Describe"
        size="lg"
        variant="error"
        disabled
        className="custom-textarea"
      />
    )

    const textarea = screen.getByPlaceholderText('Describe')
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveClass('custom-textarea')
  })

  it('trả class từ textareaVariants', () => {
    expect(textareaVariants({ size: 'xs', variant: 'success' })).toContain('min-h-18')
    expect(textareaVariants({ disabled: true })).toContain('cursor-not-allowed')
  })
})