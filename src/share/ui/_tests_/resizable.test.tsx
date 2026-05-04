
import { render, screen } from '@testing-library/react'
import React from 'react'

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '../resizable'

type ResizableGroupProps = {
  children: React.ReactNode
  className?: string
  direction: 'horizontal' | 'vertical'
}

beforeAll(() => {
  if (typeof globalThis.DOMRect === 'undefined') {
    globalThis.DOMRect = class DOMRect {
      x = 0
      y = 0
      width = 0
      height = 0
      top = 0
      right = 0
      bottom = 0
      left = 0
      static fromRect() {
        return new DOMRect()
      }
      toJSON() {
        return {}
      }
    } as unknown as typeof DOMRect
  }
})

describe('Resizable UI', () => {
  function renderResizable(children: React.ReactNode, className?: string) {
    const Group = ResizablePanelGroup as unknown as React.ComponentType<ResizableGroupProps>

    return render(
      <Group direction="horizontal" className={className}>
        {children}
      </Group>
    )
  }

  it('renders ResizablePanelGroup', () => {
    renderResizable(<div data-testid="child" />)

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    renderResizable(<div>content</div>, 'test-class')

    const group = screen.getByText('content').parentElement
    expect(group).toHaveClass('test-class')
  })

  it('renders ResizablePanel', () => {
    renderResizable(
      <ResizablePanel defaultSize={50}>
        <div data-testid="panel-child" />
      </ResizablePanel>
    )

    expect(screen.getByTestId('panel-child')).toBeInTheDocument()
  })

  it('renders ResizableHandle without handle', () => {
    renderResizable(
      <>
        <ResizablePanel defaultSize={50}>
          <div>left</div>
        </ResizablePanel>
        <ResizableHandle data-testid="handle" />
        <ResizablePanel defaultSize={50}>
          <div>right</div>
        </ResizablePanel>
      </>
    )

    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('renders ResizableHandle with handle', () => {
    renderResizable(
      <>
        <ResizablePanel defaultSize={50}>
          <div>left</div>
        </ResizablePanel>
        <ResizableHandle withHandle data-testid="handle" />
        <ResizablePanel defaultSize={50}>
          <div>right</div>
        </ResizablePanel>
      </>
    )

    const handle = screen.getByRole('separator')

    expect(handle).toBeInTheDocument()
    expect(handle.querySelector('div')).toBeInTheDocument()
  })
})
