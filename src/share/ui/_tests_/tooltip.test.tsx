
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/share/ui/tooltip'

jest.mock('radix-ui', () => ({
  Tooltip: {
    Provider: ({ children }: any) => <div data-slot="tooltip-provider">{children}</div>,
    Root: ({ children }: any) => <div data-slot="tooltip">{children}</div>,
    Trigger: ({ children }: any) => <span data-slot="tooltip-trigger">{children}</span>,
    Content: ({ children }: any) => <span data-slot="tooltip-content">{children}</span>,
    Portal: ({ children }: any) => <>{children}</>,
    Arrow: () => null,
  },
}))

describe('share/ui/tooltip', () => {
  it('render TooltipProvider và Tooltip với trigger và content', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(screen.getByText('Hover')).toBeInTheDocument()
    expect(screen.getByText('Tip text')).toBeInTheDocument()
  })
})
