
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/share/ui/accordion'

jest.mock('radix-ui', () => ({
  Accordion: {
    Root: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-slot="accordion" className={className}>{children}</div>
    ),
    Item: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-slot="accordion-item" className={className}>{children}</div>
    ),
    Header: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Trigger: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <button type="button" data-slot="accordion-trigger" className={className}>{children}</button>
    ),
    Content: ({ children, ...props }: { children: React.ReactNode }) => (
      <div data-slot="accordion-content" {...props}>{children}</div>
    ),
  },
}))
jest.mock('@/share/icons', () => ({
  ChevronDown: (props: React.ComponentPropsWithoutRef<'span'>) => (
    <span data-testid="accordion-chevron-down" {...props} />
  ),
  ChevronUp: (props: React.ComponentPropsWithoutRef<'span'>) => (
    <span data-testid="accordion-chevron-up" {...props} />
  ),
}))

describe('share/ui/accordion', () => {
  it('render Accordion với AccordionItem, Trigger, Content', () => {
    render(
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(document.querySelector('[data-slot="accordion"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="accordion-item"]')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /section 1/i })).toBeInTheDocument()
    expect(screen.getByText('Content 1')).toBeInTheDocument()
  })
  it('render Accordion với className', () => {
    render(<Accordion className="custom-accordion"><AccordionItem><AccordionTrigger>T</AccordionTrigger><AccordionContent>C</AccordionContent></AccordionItem></Accordion>)
    expect(document.querySelector('.custom-accordion')).toBeInTheDocument()
  })
})
