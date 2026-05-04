
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/share/ui/collapsible'

jest.mock('radix-ui', () => ({
  Collapsible: {
    Root: ({ children }: { children: React.ReactNode }) => <div data-slot="collapsible">{children}</div>,
    CollapsibleTrigger: ({ children }: { children: React.ReactNode }) => (
      <button type="button" data-slot="collapsible-trigger">{children}</button>
    ),
    CollapsibleContent: ({ children }: { children: React.ReactNode }) => (
      <div data-slot="collapsible-content">{children}</div>
    ),
  },
}))

describe('share/ui/collapsible', () => {
  it('render Collapsible với Trigger và Content', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    )
    expect(document.querySelector('[data-slot="collapsible"]')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Toggle' })).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
